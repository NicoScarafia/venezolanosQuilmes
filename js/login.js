
import { doc, addDoc, collection, setDoc, getDoc, getDocs, deleteDoc, updateDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-storage.js"
import { db } from './config.js';

window.addEventListener('load', function() {

    const hero = document.querySelector(".hero-section");
    hero.style.height = "8rem";
    hero.style.minHeight = "0rem";

    let userLog;
    let usersData;
    let logTrue;

    if(JSON.parse(sessionStorage.getItem("loginSomosVen"))){
        document.querySelector(".usersAdm").style.display = "block";
        document.querySelector(".activitiesAdm").style.display = "flex";
        document.querySelector("#login").style.display = "none"
        document.querySelector("#closeSession").style.display = "block"
        userLog = sessionStorage.getItem("usuarioSV")
        document.querySelector(".logedUser").innerHTML = userLog;
        document.querySelector(".login").innerHTML = userLog;
        getUsers();

        if(JSON.parse(sessionStorage.getItem("sudoSV"))){
            document.querySelector("#addUser").style.display = "block";

        } else {
            document.querySelector("#addUser").style.display = "none";
        }
        

    } else {
        document.querySelector("#login").style.display = "flex";
        document.querySelector("#closeSession").style.display = "none";
        document.querySelector(".login").innerHTML = "Log in";
    }    
    
    const user = document.querySelector("#user");
    const pass = document.querySelector("#pass");

    const submit = document.querySelector("#submit")
    submit.onclick = (e) => {
            e.preventDefault();
            login();
        }

    async function login() {
        let u = user.value;
        let p = pass.value;
        let userData;

        try {
            console.log(u);
            console.log(p);
            userData = await getDoc(doc(db, "Users", u))

        } catch (err){            
            console.error(err);
        }

        if(userData.exists()){
            console.log(userData);
            console.log(u);
            console.log(p);
            console.log(userData.data());
            console.log(userData.data().sudo);

            if(userData.data().pass == p){
                sessionStorage.setItem("loginSomosVen", true);
                document.querySelector(".usersAdm").style.display = "block";
                document.querySelector(".activitiesAdm").style.display = "flex";
                document.querySelector("#closeSession").style.display = "block";
                document.querySelector(".login").innerHTML = sessionStorage.getItem("usuarioSV");

                if(userData.data().sudo === true){
                    document.querySelector("#addUser").style.display = "block";
                    sessionStorage.setItem("sudoSV", true);
                } else {
                    document.querySelector("#addUser").style.display = "none";
                    sessionStorage.setItem("sudoSV", false);
                }

                getUsers();
                document.querySelector("#login").style.display = "none"
                document.querySelector(".logedUser").innerHTML = u;
                sessionStorage.setItem("usuarioSV", u);
                userLog = sessionStorage.getItem("usuarioSV");
            } else {
                document.querySelector(".msj").innerHTML = "Usuario y/o contraseña invalidos.";
                document.querySelector(".msj").style.color = "red"
            }               
        } else {
            document.querySelector(".msj").innerHTML = "Usuario y/o contraseña invalidos.";
            document.querySelector(".msj").style.color = "red"
        }
    }

    async function getUsers() {
        try {
            await getDocs(collection(db, "Users"))
                .then(
                    (resp) => {
                        usersData = resp.docs.map((doc) => ({id: doc.id}));
                        console.log(usersData);
                        
                        for(let i = 0; i < usersData.length; i++){
                            const userLi = document.createElement("li");
                            userLi.id = usersData[i].id;
                            userLi.innerHTML = "- " + usersData[i].id;

                            const del = document.createElement("button");
                            del.id = usersData[i].id + "Del";
                            del.innerHTML = "Eliminar";
                            del.className = "delete";
                            
                            if(JSON.parse(sessionStorage.getItem("sudoSV"))){
                                del.style.display = "block";
                            } else {
                                del.style.display = "none";
                            }

                            del.onclick = () => {eliminar(usersData[i].id);}
                            
                            document.querySelector(".userAdmUl").appendChild(userLi);
                            document.querySelector("#" + usersData[i].id).appendChild(del);
                        }
                    }
                )
        } catch (err){
            console.log(err);
        }
    }

    const changePass = document.querySelector(".changePass");
    changePass.onclick = () => {changeP()};

    const cancelChangeP = document.querySelector("#cancelChangeP");
    cancelChangeP.onclick = (e) => {
        e.preventDefault();    
        document.querySelector("#changePassUser").style.display = "none"
    };

    const newUser = document.querySelector("#newUser");
    const pass0 = document.querySelector("#pass0");
    const pass1 = document.querySelector("#pass1");

    const currentPass = document.querySelector("#currentPass");
    const newPass0 = document.querySelector("#newPass0");
    const newPass1 = document.querySelector("#newPass1");

    const confirmChangeP = document.querySelector("#confirmChangeP");
    confirmChangeP.onclick = (e) => {
        e.preventDefault();    
        changePassword(currentPass.value, newPass0.value, newPass1.value);
    }

    async function changeP(){
        document.querySelector("#changePassUser").style.display = "flex"
    }

    async function changePassword(cp, p0, p1) {
        let us = await getDoc(doc(db, "Users", sessionStorage.getItem("usuarioSV")))
        const changePassMsj = document.querySelector("#changePassMsj");
        console.log(us);
        if(us.data().pass === cp) {
            if(p0 === p1 && p0 !== ""){
                await updateDoc(doc(db, "Users", (sessionStorage.getItem("usuarioSV"))), {
                    pass: p0
                })
                    .then(() => {
                        changePassMsj.innerHTML = "Contraseña actulizada.";
                        changePassMsj.style.color = "green";
                        currentPass.value = "";
                        newPass0.value = "";
                        newPass1.value = "";
                    })
            } else {
                changePassMsj.innerHTML = "Las contraseñas nuevas no coinciden.";
                changePassMsj.style.color = "red";
            }
        } else {
            changePassMsj.innerHTML = "Contraseña actual incorrecta.";
            changePassMsj.style.color = "red";
        }

        us = ""
    }

    const addUser = document.querySelector("#addUser");
    addUser.onclick = () => {add()}

    async function add() {
        document.querySelector(".addUserInput").style.display = "flex"
    }

    const confirmUser = document.querySelector("#confirmUser");
    confirmUser.onclick = (e) => {
        e.preventDefault();
        addUserB(newUser.value, pass0.value, pass1.value)}
    
    const addUserClose = document.querySelector("#addUserClose");
    addUserClose.onclick = (e) => {
        e.preventDefault()
        document.querySelector(".addUserInput").style.display = "none"
    }

    async function addUserB(us, p0, p1) {
        
        if(check(us, p0, p1)){
            
            let sudoCheck = false;

            if(document.querySelector("#sudo").checked){
                sudoCheck = true;
            } 
            
            try {
                await setDoc(doc(db, "Users", us), {
                    pass: p0,
                    sudo: sudoCheck
                })
                    .then(() => {
                        document.querySelector(".addUserMsj").innerHTML = "Usuario agregado correctamente.";                        document.querySelector(".addUserMsj").style.color = "green"
                        newUser.value = "";
                        newPass0.value = "";
                        newPass1.value = "";
                        while(document.querySelector(".userAdmUl").firstChild){
                            document.querySelector(".userAdmUl").removeChild(document.querySelector(".userAdmUl").firstChild)
                        }
                        getUsers();
                    })
            } catch (err) {
                console.log(err);
            }

        } else {
            document.querySelector(".addUserMsj").innerHTML = "¡El usuario ya esta registrado, no ha ingresado un usuario valido o las contraseñas no coinciden!"
            document.querySelector(".addUserMsj").style.color = "red"
        }
    }
    

    async function eliminar(id) {
        await deleteDoc(doc(db, "Users", id))
            .then(() => {
                document.querySelector("#" + id).remove()
            })
    }

    const closeSession = document.querySelector("#closeSession");
    closeSession.onclick = () => {close()}

    function check(us, p0, p1) {
        console.log(p0);
        console.log(p1);
        console.log(us);
        if(p0 !== p1 || p0 === "" || p1 === "" || us === ""){
            return false;
        } 

        for(let u = 0; u < usersData.length; u++){
            if(usersData[u].id === us){
                return false;
            }
        }
        
        return true;
    }

    function close() {
        sessionStorage.setItem("loginSomosVen", false);
        sessionStorage.setItem("sudoSV", false);
        sessionStorage.setItem("usuarioSV", "");
        document.querySelector("#login").style.display = "flex";
        document.querySelector(".usersAdm").style.display = "none";
        document.querySelector(".addUserInput").style.display = "none";
        document.querySelector(".activitiesAdm").style.display = "none";
        document.querySelector("#changePassUser").style.display = "none";
        document.querySelector("#closeSession").style.display = "none";
        document.querySelector(".login").innerHTML = "Log in";
        user.value = "";
        pass.value = "";
        while(document.querySelector(".userAdmUl").firstChild){
            document.querySelector(".userAdmUl").removeChild(document.querySelector(".userAdmUl").firstChild)
        }
    }

    const form = document.querySelector("#uploader");

    const fileInput = form.querySelector("#image");
    fileInput.addEventListener("change", () => {mostrar()});

    const titleUpl = document.querySelector("#uploaderTitle");
    titleUpl.onclick = () => {
        uplMsj.innerHTML = "";
    }
    const descriptionUpl = document.querySelector("#uploaderDescr");
    const linkUpl = document.querySelector("#uploaderLink");

    function mostrar() {
        console.log(fileInput.file);
        const filesPreview = fileInput.files;

        if (!filesPreview || !filesPreview.length) {
            document.querySelector("#imagenDown").src = "";
            return;
        }
        
        console.log(filesPreview);
        const filePreview = filesPreview[0];
        const urlFile = URL.createObjectURL(filePreview);

        document.querySelector("#imagenDown").src = urlFile;
    }


    const uplMsj = document.createElement("h4");
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let fileInput = form.querySelector("#image");

        console.log(fileInput.files);

        let file = fileInput.files[0];

        uplMsj.innerHTML = "Subiendo publicacion, Por favor espere."
        document.querySelector("#uplMsj").appendChild(uplMsj)
        publish({ file });
        

    })
    
    const upload = async ({file}) => {
        let storage = getStorage();

        const storageRef = ref(storage, file.name);
        try {
            await uploadBytes(storageRef, file)
            .then((snapshot) => {
                console.log("Uploaded");            
            })
        } catch (err) {
            console.log(err);
        }
        
        return storageRef;
    }

    const addDocu = async({colle, data}) => {
        let docu = {
            ...data,
            date: Timestamp.fromDate(new Date()),
            title: titleUpl.value,
            description: descriptionUpl.value,
            link: linkUpl.value
        }

        await addDoc(collection(db, colle), docu)
            .then(() => {
                uplMsj.innerHTML = "Publicacion subida.";
                fileInput.value = "";
                titleUpl.value = "";
                descriptionUpl.value = "";
                document.querySelector("#imagenDown").src = ""
                linkUpl.value = "";
            })
    }

    const publish = async ({file}) => {
        let storageRef = await upload({file});

        return addDocu({colle: "Activities", data: {path: storageRef.fullPath}})
    
    }


}, false)