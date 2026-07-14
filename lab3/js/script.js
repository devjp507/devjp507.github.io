document.addEventListener("DOMContentLoaded", loadStates);
document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#username").addEventListener("change", checkUsername);
document.querySelector("#signupForm").addEventListener("submit", validateForm);
document.querySelector("#state").addEventListener("change", loadCounties);
document.querySelector("#password").addEventListener("click", passwordSuggestion);
document.querySelector("#passwordSuggestion").addEventListener("click", autoFill);
document.querySelector("#password").addEventListener("change", checkPassword);
document.querySelector("#passwordAgain").addEventListener("change", checkPasswordAgain);
document.querySelector("#passwordCB").addEventListener("click", autoFill);

let inUse = false;

async function displayCity() {
  try {
    let zipCode = document.querySelector("#zip").value;
    let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
    let response = await fetch(url);
    let data = await response.json();

    //the API returns false when the zip code is not found, so we can check for that case before trying to access the city property
    if (data === false) {
      document.querySelector("#city").textContent = "Zip code not found";
      document.querySelector("#latitude").textContent = "";
      document.querySelector("#longitude").textContent = "";
      return;
    }

    document.querySelector("#city").textContent = data.city;
    document.querySelector("#latitude").textContent = data.latitude;
    document.querySelector("#longitude").textContent = data.longitude;

  } catch (error) {
    document.querySelector("#city").textContent = "Unable to retrieve city";
    console.error(error);
  }
  loadCounties();
}

async function loadStates() {
  let stateMenu = document.querySelector("#state");

  stateMenu.textContent = "";

  let defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select One";
  stateMenu.appendChild(defaultOption);

  try {
    let url = "https://csumb.space/api/allStatesAPI.php";
    let response = await fetch(url);
    let data = await response.json();

    for (let item of data) {
      let option = document.createElement("option");
      option.value = item.usps;
      option.textContent = item.state;
      stateMenu.appendChild(option);
    }
  } catch (error) {
    console.error(error);

    stateMenu.textContent = "";

    let errorOption = document.createElement("option");
    errorOption.value = "";
    errorOption.textContent = "Unable to load states";
    stateMenu.appendChild(errorOption);
  }
}

async function checkUsername() {
  let username = document.querySelector("#username").value;
  let usernameError = document.querySelector("#usernameError");

  if (username.length === 0) {
    usernameError.textContent = "Username required";
    usernameError.style.color = "red";
    return false;
  }

  let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
  let response = await fetch(url);
  let data = await response.json();

  if (data.available) {
    usernameError.textContent = "Username available!";
    usernameError.style.color = "green";
    return true;
  } else {
    usernameError.textContent = "Username taken";
    usernameError.style.color = "red";
    return false;
  }
}

async function validateForm(event) {
  event.preventDefault();

  let isValidName = true;
  let isValidPassword = true;
  let isValidPasswordAgain = true;

  let usernameAvailable = await checkUsername();
  let passwordValid = await checkPassword();
  let passwordAgainValid = await checkPasswordAgain();

  if (usernameAvailable === false) {
    isValidName = false;
  }
  if (passwordValid === false) {
    isValidPassword = false;
  }
  if (passwordAgainValid === false) {
    isValidPasswordAgain = false;
  }

  if (isValidName && isValidPassword && isValidPasswordAgain) {
    document.querySelector("#signupForm").submit();
  }
}

async function loadCounties() {
  let countyMenu = document.querySelector("#county");

  
  let state = document.querySelector("#state").value;

  countyMenu.textContent = "";

  let defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select One";
  countyMenu.appendChild(defaultOption);

  try {
    let url = `https://csumb.space/api/countyListAPI.php?state=${state}`
    let response = await fetch(url);
    let data = await response.json();

    for (let item of data) {
      let option = document.createElement("option");
      option.value = state;
      option.textContent = item.county;
      countyMenu.appendChild(option);
    }
  } catch (error) {
    console.error(error);

    countyMenu.textContent = "";

    let errorOption = document.createElement("option");
    errorOption.value = "";
    errorOption.textContent = "Unable to load states";
    countyMenu.appendChild(errorOption);
  }
}
async function passwordSuggestion() {
  document.querySelector("#password_Suggestion").hidden = false;
  let url = "https://csumb.space/api/suggestedPassword.php?length=8";
  let response = await fetch(url);
  let data = await response.json();
  document.querySelector("#passwordSuggestion").style.setProperty("color", "green", "important");
  document.querySelector("#passwordSuggestion").textContent = data.password;
  document.querySelector("#passwordCB").checked = false;
}
async function autoFill() {
  if(!inUse){
    inUse = true;
    document.querySelector("#passwordSuggestion").style.setProperty("color", "red", "important");
    document.querySelector("#password").value = document.querySelector("#passwordSuggestion").textContent;
    checkPassword();
  }
  else{
    inUse =false;
    document.querySelector("#passwordSuggestion").style.setProperty("color", "green", "important");
    document.querySelector("#password").value = "";
  }
}


async function checkPassword() {
  let password = document.querySelector("#password").value;
  let passwordError = document.querySelector("#passwordError");

  if (password.length >= 6) {
    passwordError.textContent = "Password is Valid";
    passwordError.style.color = "green";
    return true;
  } else {
    passwordError.textContent = "Password must be at least six characters long";
    passwordError.style.color = "red";
    return false;
  }
}

async function checkPasswordAgain() {
  let password = document.querySelector("#password").value;
  let passwordAgain = document.querySelector("#passwordAgain").value;
  let passwordAgainError = document.querySelector("#passwordAgainError");
  let canCompare = await checkPassword();
  
  if (canCompare && passwordAgain == password && passwordAgain != "") {
    passwordAgainError.textContent = "Passwords match";
    passwordAgainError.style.color = "green";
    return true;
  } else{
    passwordAgainError.textContent = "Invalid";
    passwordAgainError.style.color = "red";
    return false;
  }

}