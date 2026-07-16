document.addEventListener("DOMContentLoaded", loadCalendar(document.querySelector("#startCalendar")));
document.addEventListener("DOMContentLoaded", loadCalendar(document.querySelector("#endCalendar")));

document.addEventListener("DOMContentLoaded", loadYears(document.querySelector("#startYear")));
document.addEventListener("DOMContentLoaded", loadYears(document.querySelector("#endYear")));

//leap year
document.querySelector("#startYear").addEventListener("change", (event) => {
    if(document.querySelector("#startMonth").value != 2){
        return;
    }else{
        editCalendar(event, 'start');
    }
});
document.querySelector("#startMonth").addEventListener("change", (event) => editCalendar(event, 'start'));

//leap year
document.querySelector("#endYear").addEventListener("change", (event) => {
    if(document.querySelector("#endMonth").value != 2){
        return;
    }else{
        editCalendar(event, 'end');
    }
});
document.querySelector("#endMonth").addEventListener("change", (event) => editCalendar(event, 'end'));


async function loadCalendar(calendar) {

    let calendarTable = calendar;
    let tdName = calendarTable.getAttribute('data-str');

    let row = document.createElement("tr");

    for (let i = 1; i<=31; i++) {
        let cell = document.createElement("td");

        if(i>28){
            cell.id = tdName + "Cell" + i;
        }
        
        //input radios
        let inp = document.createElement("input"); 
        inp.type = "radio"; 
        inp.name = tdName + "Day"; 
        inp.value = i;
        inp.id = tdName + "Day" + i
        let lb = document.createElement("label"); 
        lb.for = inp.id;
        lb.textContent = i;

        cell.appendChild(inp);
        cell.appendChild(lb);

        row.appendChild(cell);

        calendarTable.appendChild(row);

        //new row
        if(i%7 == 0){
            row = document.createElement("tr");
        }
    }
    //default
    document.querySelector(`#${tdName}Day1`).checked = true;
}

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
        document.querySelector(`#${str}Cell29`).hidden = true;
        document.querySelector(`#${str}Cell30`).hidden = true;
        document.querySelector(`#${str}Cell31`).hidden = true;
    } else if(days == 29){
        document.querySelector(`#${str}Cell29`).hidden = false;
        document.querySelector(`#${str}Cell30`).hidden = true;
        document.querySelector(`#${str}Cell31`).hidden = true;
    } else if(days == 30){
        document.querySelector(`#${str}Cell29`).hidden = false;
        document.querySelector(`#${str}Cell30`).hidden = false;
        document.querySelector(`#${str}Cell31`).hidden = true;
    }else{
        document.querySelector(`#${str}Cell29`).hidden = false;
        document.querySelector(`#${str}Cell30`).hidden = false;
        document.querySelector(`#${str}Cell31`).hidden = false;
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
            //leap year, February
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