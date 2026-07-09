document.querySelector("button").addEventListener("click", gradeQuiz);

let q4ChoicesArray = ["Maine", "Rhode Island", "Maryland", "Delaware"];
let q5ChoicesArray = ["Texas", "Alaska", "Montana", "New Mexico"];
let q6ChoicesArray = ["Colorado River", "The Rio Grande", "Yukon", "St. Lawrence"];

displayRadioChoices(q4ChoicesArray, 4);
displayRadioChoices(q5ChoicesArray, 5);
displayRadioChoices(q6ChoicesArray, 6);

let score = 0;

let attempts = localStorage.getItem("total_attempts");

if (attempts === null) {
  attempts = 0;
} else {
  attempts = Number(attempts);
}

function isFormValid() {
  let isValid = true;
  let q1Response = document.querySelector("#q1").value;
  let q10Response = document.querySelector("#q10").value;
  let validationFdbk = document.querySelector("#validationFdbk");

  if (q1Response === "" && q10Response === "") {
    isValid = false;
    validationFdbk.textContent = "Question 1 and 10 were not answered";
  }
  else if (q1Response === "") {
    isValid = false;
    validationFdbk.textContent = "Question 1 was not answered";
  }
  else if (q10Response === "") {
    isValid = false;
    validationFdbk.textContent = "Question 10 was not answered";
  }

  return isValid;
}

function gradeQuiz() {
  document.querySelector("#validationFdbk").textContent = "";

  if (!isFormValid()) {
    return;
  }

  score = 0;
  let q1Response = document.querySelector("#q1").value.toLowerCase();
  let q10Response = document.querySelector("#q10").value.toLowerCase();
  let q2Response = document.querySelector("#q2").value;
  let q8Response = document.querySelector("#q8").value;
  let q9Response = document.querySelector("#q9").value;

  if (q1Response === "sacramento") {
    rightAnswer(1);
  } else {
    wrongAnswer(1);
  }
  if (q10Response === "florida") {
    rightAnswer(10);
  } else {
    wrongAnswer(10);
  }

  if (q2Response === "mo") {
    rightAnswer(2);
  } else {
    wrongAnswer(2);
  }

  if (q8Response === "ee") {
    rightAnswer(8);
  } else {
    wrongAnswer(8);
  }

  if (q9Response === "sd") {
    rightAnswer(9);
  } else {
    wrongAnswer(9);
  }


  if (document.querySelector("#Jefferson").checked &&
    document.querySelector("#Roosevelt").checked &&
    !document.querySelector("#Jackson").checked &&
    !document.querySelector("#Franklin").checked) {
  rightAnswer(3);
  } else {
    wrongAnswer(3);
  }

  let selectedQ4 = document.querySelector("input[name=q4]:checked");
  if (selectedQ4 !== null && selectedQ4.value === "Rhode Island") {
    rightAnswer(4);
  } else {
    wrongAnswer(4);
  }

  let selectedQ5 = document.querySelector("input[name=q5]:checked");
  if (selectedQ5 !== null && selectedQ5.value === "Alaska") {
    rightAnswer(5);
  } else {
    wrongAnswer(5);
  }

  let selectedQ6 = document.querySelector("input[name=q6]:checked");
  if (selectedQ6 !== null && selectedQ6.value === "The Rio Grande") {
    rightAnswer(6);
  } else {
    wrongAnswer(6);
  }

  if (document.querySelector("#Tennessee").checked &&
    document.querySelector("#Missouri").checked &&
    !document.querySelector("#Kansas").checked &&
    !document.querySelector("#Iowa").checked) {
  rightAnswer(7);
  } else {
    wrongAnswer(7);
  }

  let finalPercentage = (score/200) * 100 

  if(finalPercentage < 80){
    document.querySelector("#totalScore").style.setProperty("color", "red", "important");
  } else{
    document.querySelector("#totalScore").style.setProperty("color", "green", "important");
  }
  if(finalPercentage > 80){
    document.querySelector("#above80").classList.remove('hidden');
    document.querySelector("#above80").textContent = "Congratulations on getting " + finalPercentage + "%!!";
  }

  document.querySelector("#validationFdbk").classList.remove('hidden');
  document.querySelector("#totalScore").classList.remove('hidden');
  document.querySelector("#totalAttempts").classList.remove('hidden');

  document.querySelector("#totalScore").textContent = `Total Score: ${score}`;
  
  attempts++;
  document.querySelector("#totalAttempts").textContent = `Total Attempts: ${attempts}`;
  localStorage.setItem("total_attempts", attempts);
}

function setMarkImage(index, imageName, altText) {
  let markContainer = document.querySelector(`#markImg${index}`);
  markContainer.textContent = "";

  let img = document.createElement("img");
  img.src = `img/${imageName}`;
  img.alt = altText;
  markContainer.appendChild(img);
}

function rightAnswer(index) {
  let feedback = document.querySelector(`#q${index}Feedback`);
  feedback.textContent = "Correct!";
  feedback.style.setProperty("background-color", "green", "important");
  feedback.className = "bg-success text-white";
  setMarkImage(index, "checkmark.png", "Checkmark");
  document.querySelector(`#q${index}pts`).style.color="green";
  document.querySelector(`#q${index}pts`).textContent = "20/20pts";
  score += 20;
}

function wrongAnswer(index) {
  let feedback = document.querySelector(`#q${index}Feedback`);
  feedback.textContent = "Incorrect!";
  feedback.style.setProperty("background-color", "red", "important");
  feedback.className = "bg-warning text-white";
  setMarkImage(index, "xmark.png", "X mark");
  document.querySelector(`#q${index}pts`).style.color="red";
  document.querySelector(`#q${index}pts`).textContent = "0/20pts";
}

function displayRadioChoices(array, index) {
  
  shuffleArray(array);

  let choicesContainer = document.querySelector(`#q${index}Choices`);
  choicesContainer.textContent = "";

  for (let choice of array) {
    let input = document.createElement("input");
    input.type = "radio";
    input.name = `q${index}`;
    input.id = choice;
    input.value = choice;

    let label = document.createElement("label");
    label.htmlFor = choice;
    label.textContent = choice;

    choicesContainer.appendChild(input);
    choicesContainer.appendChild(label);
    choicesContainer.appendChild(document.createTextNode(" "));
  }
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
