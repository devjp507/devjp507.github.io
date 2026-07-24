const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1;
const currentDay = currentDate.getDate();
let isStartCurrentYear = true;
let isEndCurrentYear = true;
let startDaysHide = false;
let endDaysHide = false;

document.addEventListener("DOMContentLoaded", loadCalendar(document.querySelector("#startCalendar")));
document.addEventListener("DOMContentLoaded", loadCalendar(document.querySelector("#endCalendar")));

document.addEventListener("DOMContentLoaded", loadYears(document.querySelector("#startYear")));
document.addEventListener("DOMContentLoaded", loadYears(document.querySelector("#endYear")));

document.querySelector("#searchResults").addEventListener("submit", validateForm);

async function validateForm(event) {
    let startYear = document.querySelector("#startYear").value;
    let startMonth = document.querySelector("#startMonth").value;
    let startDay = document.querySelector('input[name="startDay"]:checked').value;

    let endYear = document.querySelector("#endYear").value;
    let endMonth = document.querySelector("#endMonth").value;
    let endDay = document.querySelector('input[name="endDay"]:checked').value;

    let magSign = document.querySelector('input[name="comparisonOp"]:checked').value;
    let magValue = document.querySelector("#mag").value;

    event.preventDefault();
    let validDates = await checkDates();
    if(validDates){
        localStorage.setItem("startYear", startYear);
        localStorage.setItem("startMonth", startMonth);
        localStorage.setItem("startDay", startDay);

        localStorage.setItem("endYear", endYear);
        localStorage.setItem("endMonth", endMonth);
        localStorage.setItem("endDay", endDay);

        localStorage.setItem("magSign", magSign);
        localStorage.setItem("magValue", magValue);

        document.querySelector("#dateError").textContent ="";
        document.querySelector("#searchResults").submit();
    }else{
        document.querySelector("#dateError").textContent = "Invalid Dates!!"
    } 
}
async function checkDates(){
    let startYear = document.querySelector("#startYear").value;
    let startMonth = document.querySelector("#startMonth").value;
    let startDay = document.querySelector('input[name="startDay"]:checked').value;

    let endYear = document.querySelector("#endYear").value;
    let endMonth = document.querySelector("#endMonth").value;
    let endDay = document.querySelector('input[name="endDay"]:checked').value;

    if(startYear < endYear || startMonth < endMonth){
        return true;
    }
    else if(startYear == endYear && startMonth == endMonth && startDay < endDay){
        return true;
    }
    else{
        return false;
    }
}


//change start month
document.querySelector("#startMonth").addEventListener("change", () => editCalendar("start"));
//handle current year
document.querySelector("#startYear").addEventListener("change", () => {
    if(document.querySelector("#startYear").value != currentYear && isStartCurrentYear){
        isStartCurrentYear = false;
        handleCurrentYear(isStartCurrentYear, "start");
    }
    else if(document.querySelector("#startYear").value == currentYear && !isStartCurrentYear){
        isStartCurrentYear = true;
        handleCurrentYear(isStartCurrentYear, "start");
    }else{return;}//switching between non-current years
});
//reset start calendar
document.querySelector("#startYear").addEventListener("change", resetMonthAndDay);
document.querySelector("#startMonth").addEventListener("change", resetDay);


//change end month
document.querySelector("#endMonth").addEventListener("change", () => editCalendar("end"));
//handle current year
document.querySelector("#endYear").addEventListener("change", () => {
    if(document.querySelector("#endYear").value != currentYear && isEndCurrentYear){
        isEndCurrentYear = false
        handleCurrentYear(isEndCurrentYear, "end");
    }
    else if(document.querySelector("#endYear").value == currentYear && !isEndCurrentYear){
        isEndCurrentYear = true;
        handleCurrentYear(isEndCurrentYear, "end");
    }else{return;}//switching between non-current years
});
//reset end calendar
document.querySelector("#endYear").addEventListener("change", resetMonthAndDay);
document.querySelector("#endMonth").addEventListener("change", resetDay);



async function loadCalendar(calendar) {

    let calendarTable = calendar;
    let prefix = calendarTable.getAttribute('data-str');

    let row = document.createElement("tr");

    for (let i = 1; i<=31; i++) {
        let cell = document.createElement("td");

        if(i>28){
            cell.id = prefix + "Cell" + i;
        }
        
        //input radios
        let inp = document.createElement("input"); 
        inp.type = "radio"; 
        inp.name = prefix + "Day"; 
        inp.value = i;
        inp.id = prefix + "Day" + i;
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
    document.querySelector(`#${prefix}Day1`).checked = true;
    handleCurrentYear(true, prefix);
}

async function loadYears(element) {
    
    let yearMenu = element;

    for (let i = currentYear; i>=1811; i--) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        yearMenu.appendChild(option);
    }
    //default
    yearMenu.value = currentYear;
}

async function handleCurrentYear(trf, prefix) {
    //hide and unhide month options
    let monthSelection = document.querySelector(`#${prefix}Month`);
    for(let option of monthSelection.options){
        if(option.value > currentMonth){
            option.hidden = trf;
        }
    }
}


async function resetMonthAndDay() {
    let prefix = this.getAttribute("class");
    document.querySelector(`#${prefix}Day1`).checked = true;
    document.querySelector(`#${prefix}Month`).value = 1;
    editCalendar(prefix);
}

async function resetDay() {
    let prefix = this.getAttribute("class");
    document.querySelector(`#${prefix}Day1`).checked = true;
}

async function editCalendar(str) {
    let month = document.querySelector(`#${str}Month`).value;
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

    let isCurrentMonth = month == currentMonth;
    let isCurrentYear = document.querySelector(`#${str}Year`).value == currentYear;

    if(str == "start"){
        if(isCurrentYear && isCurrentMonth || startDaysHide){
        //hide and unhide day radios
        startDaysHide = isCurrentYear && isCurrentMonth;
        hideDaysFunc(startDaysHide, str);
        }
    }
    else if(str == "end"){
        if(isCurrentYear && isCurrentMonth || endDaysHide){
        //hide and unhide day radios
        endDaysHide = isCurrentYear && isCurrentMonth;
        hideDaysFunc(endDaysHide, str);
        }
    }
}

async function hideDaysFunc(hideDays, str) {
    let dayRadioGroup = document.getElementsByName(str + "Day");
    dayRadioGroup.forEach(radio => {
        if(radio.value > currentDay){
            radio.hidden = hideDays;
        }
    });
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