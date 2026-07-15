document.addEventListener("DOMContentLoaded", loadYears);
document.querySelector("#startMonth").addEventListener("change", displayCalendar);
document.querySelector("#startYear").addEventListener("change", displayCalendar);



async function loadYears() {
    let yearMenu = document.querySelector("#startYear");

    yearMenu.textContent = "";

    let defaultOption = document.createElement("option");
    defaultOption.value = "2026";
    defaultOption.textContent = "2026";
    yearMenu.appendChild(defaultOption);

    for (let i = 2025; i>=1811; i--) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        yearMenu.appendChild(option);
    }
}



async function displayCalendar() {
    let month = document.querySelector("#startMonth").value;
    let days = await getDays(month);

    if(days == 28){
        document.querySelector("#day29").hidden = true;
        document.querySelector("#day30").hidden = true;
        document.querySelector("#day31").hidden = true;
    } else if(days == 29){
        document.querySelector("#day29").hidden = false;
        document.querySelector("#day30").hidden = true;
        document.querySelector("#day31").hidden = true;
    } else if(days == 30){
        document.querySelector("#day29").hidden = false;
        document.querySelector("#day30").hidden = false;
        document.querySelector("#day31").hidden = true;
    }else{
        document.querySelector("#day29").hidden = false;
        document.querySelector("#day30").hidden = false;
        document.querySelector("#day31").hidden = false;
    }
    
}
async function getDays(month) {
    switch(month){
        case '1':
        case '3':
        case '5':
        case '7': 
        case '8':
        case '10':
        case '12':
            return 31;
        case '2':
            if(document.querySelector("#startYear").value % 4 == 0 || document.querySelector("#startYear").value % 400 == 0){
                return 29;
            } else{return 28;}
        case '4':
        case '6':
        case '9':
        case '11':
            return 30;
        default:
            return 99;
    }
}