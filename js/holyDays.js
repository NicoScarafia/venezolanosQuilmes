
import { doc, collection, setDoc, getDoc, getDocs, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
import { db } from "./config.js";

let days;

window.addEventListener('load', function() {   
    
    if(JSON.parse(sessionStorage.getItem("loginSomosVen"))){
        document.querySelector(".addInput").style.display = "block";
        document.querySelector(".login").innerHTML = sessionStorage.getItem("usuarioSV");
    } else {
        document.querySelector(".login").innerHTML = "Log in";
    }

    const addInput = document.querySelector(".addInput");
    addInput.onclick = () =>{
        document.querySelector(".input").style.display = "flex";
    }

    const closeBtn = document.querySelector("#closeButton");
    closeBtn.onclick = () =>{        
        document.querySelector(".input").style.display = "none";
    }

    function Img() {
        const imgSet = document.createElement("img");
        imgSet.src =  document.querySelector("#imgInput").value;
        console.log(imgSet.src);
        if(document.querySelector("#imgSet").hasChildNodes()){
            document.querySelector("#imgSet").removeChild(document.querySelector("#imgSet").firstChild);
        }
        
        document.querySelector("#imgSet").appendChild(imgSet)
    }

    const arrayMonth = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

    let d = "";
    let m = "";
    let celeb = "";
    let img = "";

    const addButton = document.querySelector("#addButton");
    addButton.onclick = addData;

    async function addData(event) {
        event.preventDefault();
        d = document.querySelector("#dayInput").value;
        m = document.querySelector("#monthInput").value;
        celeb = document.querySelector("#celebInput").value;
        img = document.querySelector("#imgInput").value + celeb;

        if((d > 31 || m > 31) || (d > new Date(new Date().getFullYear(), 2 , 0).getDate() && 
            m == 2) || (d > 30 && [4,6,9,11].includes(m)) || d < 1 || m < 1){
            
            document.querySelector(".msj").innerHTML = "Fecha NO valida.";

        } else if(img == "none"){

            document.querySelector(".msj").innerHTML = "Seleccione una Imagen.";

        } else if(celeb == ""){

            document.querySelector(".msj").innerHTML = "Debe ingresar una Celebracion.";

        } else {

            let id = arrayMonth[m-1].slice(0,3) + d;
            console.log(id);
            let consult;

            try {
                consult = await getDoc(doc(db, "Celebrations", id));

            } catch(err){
                document.querySelector(".msj").innerHTML = "¡Hubo un error! Intentenlo otra vez.";
                console.error(err);
            }
            
            if(consult.exists()){
                try {
                    await updateDoc(doc(db, "Celebrations", id), {
                        celebration: arrayUnion(celeb),
                        img: arrayUnion(img)
                    })
                        .then(() => {
                            document.querySelector(".msj").innerHTML = "Agregado Correctamente.";
                            document.querySelector("#dayInput").value = "";
                            m = document.querySelector("#monthInput").value = "";
                            celeb = document.querySelector("#celebInput").value = "";
                            img = document.querySelector("#imgInput").value = "none";
                            document.querySelector("#imgSet").removeChild(document.querySelector("#imgSet").firstChild);
                        })
                } catch(err){

                    document.querySelector(".msj").innerHTML = "¡Hubo un error! Intentenlo otra vez.";
                    console.error(err);
                }
            } else {

                try {
                    await setDoc(doc(db, "Celebrations", id), {
                        celebration: [celeb],
                        img: [img],
                    })
                        .then(() => {
                            document.querySelector(".msj").innerHTML = "Agregado Correctamente.";
                            document.querySelector("#dayInput").value = "";
                            m = document.querySelector("#monthInput").value = "";
                            celeb = document.querySelector("#celebInput").value = "";
                            img = document.querySelector("#imgInput").value = "none";
                            document.querySelector("#imgSet").removeChild(document.querySelector("#imgSet").firstChild);
                        })                   
                } catch(err){
                    document.querySelector(".msj").innerHTML = "¡Hubo un error! Intentenlo otra vez.";
                    console.error(err);
                }                
            }        
        }
    }

    document.querySelector("#dayInput").addEventListener("change", limpiar);
    document.querySelector("#monthInput").addEventListener("change", limpiar);
    document.querySelector("#celebInput").addEventListener("change", limpiar);
    document.querySelector("#imgInput").addEventListener("change", Img);

    function limpiar() {
        document.querySelector(".msj").innerHTML = "";
    }

    async function obtener() { 
        
        try {
            await getDocs(collection(db, "Celebrations")) 
                .then((resp) =>{
                    console.log(resp.docs);
                    days = resp.docs.map((docu) => ({id: docu.id, ...docu.data()}));
                    console.log(days);
                })
        } catch (err){
            document.querySelector(".msj").innerHTML = "¡Hubo un error! Intentenlo otra vez.";
            console.error(err);
        }

        for(let i = 0; i < days.length; i++){

            let id = days[i].id;
            
            for(let j = 0; j < days[i].img.length; j++){

                const dayDiv = document.createElement("div");
                dayDiv.className = "dayDiv";
                dayDiv.id = id + "-" + j;
                dayDiv.onclick = () => {openDetail(id);}
                document.querySelector("#divImg" + id).appendChild(dayDiv);
        
                const mark = document.createElement("img");
                mark.className = "markImg";
                mark.src = days[i].img[j].slice(0, days[i].img[j].length - days[i].celebration[j].length)
                document.querySelector("#" + dayDiv.id).appendChild(mark);
            }            
        }    
    }

    document.querySelector(".detailClose").onclick = () => {closeDetail();}
    

    function openDetail(id) {

        let month;

        for(let i = 0; i < arrayMonth.length; i++){
            if(id.slice(0,3) === arrayMonth[i].slice(0,3)){
                month = arrayMonth[i];
            }
        }
        document.querySelector(".detail").style.display = "flex";
        document.querySelector(".detail h3").innerHTML = month + " " + id.slice(3);

        let dayData;

        for(let d = 0; d < days.length; d++) {
            console.log(days[d].id);
            if (days[d].id == id){
                dayData = {
                    celebration: days[d].celebration,
                    img: days[d].img
                }
                break;
            } 
        }
        

        console.log(dayData);

        for(let i = 0; i < dayData.celebration.length; i++){
            const li = document.createElement("li");
            li.id = "Li-0" + i + "-" + id;

            document.querySelector(".detailUl").appendChild(li);

            const liH3 = document.createElement("h3");
            liH3.className = "liH3";
            liH3.innerHTML =  dayData.celebration[i];

            li.appendChild(liH3);

            if(JSON.parse(sessionStorage.getItem("loginSomosVen"))){
                const liDel = document.createElement("button");
                liDel.id = "Del-" + li.id;
                liDel.innerHTML = "Borrar";
                liDel.onclick = () => {eliminar(li.id, dayData.celebration[i], dayData.img[i]);}
            
                li.appendChild(liDel)
            }
            
        }
    }

    function closeDetail() {
        document.querySelector(".detail").style.display = "none";


        while (document.querySelector(".detailUl").firstChild) {
            document.querySelector(".detailUl").removeChild(document.querySelector(".detailUl").firstChild);
        }

        if(JSON.parse(sessionStorage.getItem("loginSomosVen"))){
            location.reload();
        }        
        
    }

    async function eliminar(id, ce, im) {
        
        try {
            await updateDoc(doc(db, "Celebrations", id.slice(6)), {
                celebration: arrayRemove(ce),
                img: arrayRemove(im)
            })
                // .then(() => {
                   
                // })
        } catch(err){
            console.error(err);
        }

        console.log(id);
        document.querySelector("#" + id).remove();
    }

    obtener();

    
}, false);

export const data = days;