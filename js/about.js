import { doc, collection, getDocs, getDoc, orderBy, limit, query, deleteDoc } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
import { db } from "./config.js";

window.addEventListener('load', function() {

    updateEmail();
    console.log("hola");

    async function updateEmail() {
        getDoc(doc(db, "ContactData", "Email"))
        .then((resp) => {
            console.log(resp.data());
            document.querySelector("#liEmail").href = "mailto:" + resp.data().mail;
            document.querySelector("#liEmail").innerHTML = resp.data().mail;
        })
    }


}, false)