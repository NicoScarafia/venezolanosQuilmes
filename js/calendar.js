window.addEventListener('load', function() {

    const hero = document.querySelector(".hero-section");
    hero.style.height = "8rem";
    hero.style.minHeight = "0rem";

    const year = document.createElement("div");
    year.className = "year";
    document.querySelector("#calendar").appendChild(year);

    const arrayMonth = ["Dic", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", "Ene"];
    const arrayDays = [31,31,new Date(new Date().getFullYear(), 2, 0).getDate(),31,30,31,30,31,31,30,31,30,31,31];
    const arrayDaysName = ["DO", "LU", "MA", "MI", "JU", "VI", "SA"];

    let ene1 = new Date(new Date().getFullYear(), 0, 1).getDay();
    let start = ene1;

    for(let i = 0; i < 12; i++){

        let dayNum = new Date(new Date().getFullYear(), i+1 , 0).getDate();

        const month = document.createElement("div");
        month.id = arrayMonth[i+1];
        month.className = "month"
        document.querySelector(".year").appendChild(month)

        const monthTitle = document.createElement("h3");
        monthTitle.innerText = arrayMonth[i+1];
        document.querySelector("#" + arrayMonth[i+1]).appendChild(monthTitle);

        const daysNames = document.createElement("div");
        daysNames.id = "daysNames" + arrayMonth[i+1].slice(0,3);
        daysNames.className = "daysNames";
        document.querySelector("#" + arrayMonth[i+1]).appendChild(daysNames);

        for(let j = 0; j < 7; j++){
            const dayName = document.createElement("div");
            let id = "dayName" + arrayMonth[i+1].slice(0,3) + arrayDaysName[j];
            dayName.id = id;
            dayName.className = "dayName";
            dayName.innerHTML = arrayDaysName[j];
            document.querySelector("#daysNames" + arrayMonth[i+1].slice(0,3)).appendChild(dayName);
        }
        

        const dayGrid = document.createElement("div")
        dayGrid.id = "dayGrid" + arrayMonth[i+1].slice(0,3)
        dayGrid.className = "dayGrid"

        document.querySelector("#" + arrayMonth[i+1]).appendChild(dayGrid);
        
        let row = 0;

        if ((start + dayNum) % 7 == 0){
            row = (start + dayNum) / 7;

            if(start == 7){
                row --;
                start = 0;
            }

            document.querySelector("#dayGrid" + arrayMonth[i+1].slice(0,3)).style.gridTemplateRows = "repeat(" + row + ", auto)";
        } else {
            row = Math.floor((start + dayNum) / 7) + 1;
            
            if(start == 7){
                row --;
                start = 0;
            }

            document.querySelector("#dayGrid" + arrayMonth[i+1].slice(0,3)).style.gridTemplateRows = "repeat(" + row + ", auto)"
        }  

        for(let j = 0; j < (row * 7); j++){
            const day = document.createElement("div");
            day.className = "day"            

            const divNumber = document.createElement("div");
            
            const divImg = document.createElement("div");            

            if (j < start){
                day.id = "pre" + arrayMonth[i].slice(0,3) + (arrayDays[i] - start + j + 1);
                day.style.color = "rgb(167, 163, 163)";

                divNumber.id = "divNum" + day.id;
                divNumber.innerHTML = arrayDays[i] - start + j + 1;
                
            } else if (j >= start && j < dayNum + start){
                day.id = arrayMonth[i+1].slice(0,3) + (j - start + 1)
                day.style.border = "3px solid black";

                divNumber.id = "divNum" + day.id;
                divNumber.innerHTML = j - start + 1;

            } else if (j >= dayNum + start ){
                day.id = "post" + arrayMonth[i+2].slice(0,3) + (j - start - dayNum + 1);
                day.style.color = "rgb(167, 163, 163)";

                divNumber.id = "divNum" + day.id;
                divNumber.innerHTML = j - start - dayNum + 1; 
            }

            let passId = day.id;

            day.onmouseover = () => {hoverIn(passId);}
            day.onmouseout = () => {hoverOut(passId);}
            divNumber.className = "divNum";
            
            divImg.id = "divImg" + day.id;
            divImg.className = "divImg";
            
            document.querySelector("#dayGrid" + arrayMonth[i+1].slice(0,3)).appendChild(day);
            document.querySelector("#" + day.id).appendChild(divNumber);
            document.querySelector("#" + day.id).appendChild(divImg);
        }

        start = 7 - ((row * 7) - start - dayNum);
    }    

    function hoverIn(id) {
        document.querySelector("#" + id).style.border = "3px solid gold";
    }

    function hoverOut(id) {
        if(id.slice(0,3) === "pre" || id.slice(0,3) === "pos"){
            document.querySelector("#" + id).style.border = "1px solid black";
        } else {
            document.querySelector("#" + id).style.border = "3px solid black";
        }
        
    }

}, false);