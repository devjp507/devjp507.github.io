document.addEventListener("DOMContentLoaded", loadYears(document.querySelector("#startYear")));
document.addEventListener("DOMContentLoaded", loadYears(document.querySelector("#endYear")));

document.querySelector("#startYear").addEventListener("change", (event) => editCalendar(event, 'start'));
document.querySelector("#startMonth").addEventListener("change", (event) => editCalendar(event, 'start'));

document.querySelector("#endYear").addEventListener("change", (event) => editCalendar(event, 'end'));
document.querySelector("#endMonth").addEventListener("change", (event) => editCalendar(event, 'end'));


async function loadYears(element) {
    
    let yearMenu = element;

    for (let i = 2025; i>=1811; i--) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        yearMenu.appendChild(option);
    }
}
async function editCalendar(event, str) {
    let month = document.querySelector(`#${str}Month`).value
    let days = await getDays(month, str);
    
    if(days == 28){
        document.querySelector(`#${str}Day29`).hidden = true;
        document.querySelector(`#${str}Day30`).hidden = true;
        document.querySelector(`#${str}Day31`).hidden = true;
    } else if(days == 29){
        document.querySelector(`#${str}Day29`).hidden = false;
        document.querySelector(`#${str}Day30`).hidden = true;
        document.querySelector(`#${str}Day31`).hidden = true;
    } else if(days == 30){
        document.querySelector(`#${str}Day29`).hidden = false;
        document.querySelector(`#${str}Day30`).hidden = false;
        document.querySelector(`#${str}Day31`).hidden = true;
    }else{
        console.log("days + " + days);
        document.querySelector(`#${str}Day29`).hidden = false;
        document.querySelector(`#${str}Day30`).hidden = false;
        document.querySelector(`#${str}Day31`).hidden = false;
    }
}
async function getDays(month, str) {
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
            //leap year
            if(document.querySelector(`#${str}Year`).value % 4 == 0 || document.querySelector(`#${str}Year`).value % 400 == 0){
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