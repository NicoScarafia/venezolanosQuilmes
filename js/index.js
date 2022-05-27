import { doc, collection, getDocs, orderBy, limit, query, deleteDoc } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-storage.js";
import { db } from "./config.js";

window.addEventListener('load', function() {

    if(JSON.parse(sessionStorage.getItem("loginSomosVen"))){
        document.querySelector(".login").innerHTML = this.sessionStorage.getItem("usuarioSV");
    } else {
        document.querySelector(".login").innerHTML = "Log in";
    }


    const actividades_content = document.querySelector(".actividades_content");
    actividades_content.style.display = "none";

    const actividades_link = document.querySelector(".actividades_link");
    actividades_link.style.display = "none";

    const actividades = document.querySelector("#actividades");
    const carga = document.createElement("h2");
    carga.className = "carga";
    carga.innerHTML = "CARGANDO"
    actividades.appendChild(carga);

    let fileData;

    queryData();

    async function queryData() {
        console.log("Query");
        
        await getDocs(query(collection(db, "Activities"), orderBy("date", "desc"), limit(6)))
            .then((resp) => {
                fileData = resp.docs.map((doc) => ({id: doc.id, ...doc.data()}))
                console.log(fileData);
                loadActive();
            })
    }
        
    async function loadActive() {
        console.log("start");
        for(let i = 0; i < fileData.length; i++){
            let dateid = fileData[i].date.seconds.toString();
            console.log(dateid);

            const actividades_card = document.createElement("div");
            actividades_card.className = "actividades_card";

            const card_image = document.createElement("div");
            card_image.className = "card_image";

            const act_imagen = document.createElement("img");
            act_imagen.className = "act_imagen";

            const card_text = document.createElement("div");
            card_text.className = "card_text";

            const card_heading = document.createElement("div");
            card_heading.className = "card_heading";

            const h4 = document.createElement("h4");
            h4.className = "act_titulo";

            const card_date = document.createElement("div");
            card_date.className = "card_date";

            const i0 = document.createElement("i");
            i0.classList = "fa-regular fa-calendar";

            const span = document.createElement("span");
            span.className = "act_fecha";

            const card_main_text = document.createElement("div");
            card_main_text.className = "card_main-text";

            const act_texto = document.createElement("act_texto");
            act_texto.className = "act_texto";

            const card_link = document.createElement("div");
            card_link.className = "card_link";

            const act_link = document.createElement("a");
            act_link.className = "act_link";
            act_link.target = "_blank";

            const i1 = document.createElement("i");
            i1.classList = "fa-solid fa-arrow-up-right-from-square";
    
            actividades_card.id = "actividades_card" + dateid;
            card_image.id = "card_image" + dateid;
            act_imagen.id = "act_imagen" + dateid;
            console.log(act_imagen.id);
            card_text.id = "card_text" + dateid;
            card_heading.id = "card_heading" + dateid;
            h4.id = "act_titulo" + dateid;
            h4.innerHTML = fileData[i].title;
            card_date.id = "card_date" + dateid;
            // i0
            span.id = "act_fecha" + dateid;
            span.innerHTML = "Publicado el " + fileData[i].date.toDate().toLocaleDateString('en-GB');
            card_main_text.id = "card_main_text" + dateid;
            act_texto.id = "act_texto" + dateid;
            act_texto.innerHTML = fileData[i].description.slice(0,370) + "...";
            card_link.id = "card_link" + dateid;
            act_link.id = "act_link" + dateid;
            act_link.href = fileData[i].link
            // i1
    
            actividades_content.appendChild(actividades_card);
                document.querySelector("#actividades_card" + dateid).appendChild(card_image);
                    document.querySelector("#card_image" + dateid).appendChild(act_imagen);
                document.querySelector("#actividades_card" + dateid).appendChild(card_text);
                    document.querySelector("#card_text" + dateid).appendChild(card_heading);
                        document.querySelector("#card_heading" + dateid).appendChild(h4);
                    document.querySelector("#card_text" + dateid).appendChild(card_date);
                        document.querySelector("#card_date" + dateid).appendChild(i0);
                        document.querySelector("#card_date" + dateid).appendChild(span);
                    document.querySelector("#card_text" + dateid).appendChild(card_main_text);
                        document.querySelector("#card_main_text" + dateid).appendChild(act_texto);
                    document.querySelector("#card_text" + dateid).appendChild(card_link);
                        document.querySelector("#card_link" + dateid).appendChild(act_link);
                            document.querySelector("#act_link" + dateid).appendChild(i1);

            const verMas = document.createElement("a");
            verMas.id = "verMas" + dateid;
            verMas.className = "verMas"
            verMas.innerHTML = "Ver Mas"
            verMas.href = "pages/actividades.html#" + dateid;

            document.querySelector("#card_main_text" + dateid).appendChild(verMas);

            const del = document.createElement("button");
            del.innerHTML = "Eliminar"
            del.id = "del" + dateid;
            del.className = "del";

            if(JSON.parse(sessionStorage.getItem("sudoSV"))){
                console.log("sudo");
                del.style.display = "block";
            } else {
                del.style.display = "none";
            }

            del.onclick = () => {eliminar(fileData[i].id, "actividades_card" + dateid)}

            document.querySelector("#card_text" + dateid).appendChild(del);

            console.log(actividades_content);
        }

        for(let i = 0; i < fileData.length; i++){
            const pathRef = ref(getStorage(), fileData[i].path);
            console.log("act_imagen" + fileData[i].date.seconds.toString());
            const imgUrl = document.querySelector("#act_imagen" + fileData[i].date.seconds.toString())
            console.log(imgUrl);
            
            await getDownloadURL(pathRef)
                .then((url) => {
                    console.log(url);
                    console.log(imgUrl);
                    imgUrl.src = url;
                })
            
            let punto = ".".repeat(i)
            carga.innerHTML = "CARGANDO" + punto;
        }
        carga.style.display = "none";
        actividades_content.style.display = "flex";
        actividades_link.style.display = "block";
        console.log("end");
    }

    async function getImg(path) {
        console.log(path);
        
    }

    function eliminar(id, actId) {
        deleteDoc(doc(db, "Activities", id))
            .then(() => {
                document.querySelector("#" + actId).remove()
            })
    }

    

},false)