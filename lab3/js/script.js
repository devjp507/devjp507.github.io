document.addEventListener("DOMContentLoaded", loadStates);
document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#username").addEventListener("change", checkUsername);
document.querySelector("#signupForm").addEventListener("submit", validateForm);
document.querySelector("#state").addEventListener("change", loadCounties);
document.querySelector("#password").addEventListener("click", passwordSuggestion);
document.querySelector("#passwordSuggestion").addEventListener("click", autoFill);
document.querySelector("#password").addEventListener("change", checkPassword);

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

  let username = document.querySelector("#username").value;
  let usernameError = document.querySelector("#usernameError");
  let password = document.querySelector("#password").value; 

  usernameError.textContent = "";

  if (username.length === 0) {
    usernameError.textContent = "Username required";
    usernameError.style.color = "red";
    isValidName = false;
  } else {
    let usernameAvailable = await checkUsername();
    let currentPassword = await checkPassword();

    if (usernameAvailable === false) {
      isValidName = false;
    }
    if (checkPassword === false) {
      isValidPassword = false;
    }
  }

  if (isValidName && isValidPassword) {
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
async function passwordSuggestion(){
    
  let url = "https://csumb.space/api/suggestedPassword.php?length=8";
  let response = await fetch(url);
  let data = await response.json();
  document.querySelector("#passwordSuggestion").style.setProperty("color", "green", "important");
  document.querySelector("#passwordSuggestion").textContent = data.password;
    
}
async function autoFill(){
  document.querySelector("#passwordSuggestion").style.setProperty("color", "red", "important");
  document.querySelector("#password").value = document.querySelector("#passwordSuggestion").value;

}

async function checkPassword() {
  let password = document.querySelector("#password").value;
  let passwordError = document.querySelector("#passwordError");
  let passwordAgain = document.querySelector("#passwordAgain").value;
  let passwordAgainError = document.querySelector("#passwordAgainError").value;

  if (password.length >= 6) {
    passwordError.textContent = "Password is Valid";
    passwordError.style.color = "green";
    return true;
  } else {
    passwordError.textContent = "Password must be at least six characters long";
    passwordError.style.color = "red";
    return false;
  }
  /* if (passwordAgain == password) {
    passwordAgainError.textContent = "Password matches Password";
    passwordAgainError.style.color = "green";
    return true;
  } else{
    passwordAgainError.textContent = "Does not match password";
    passwordAgainError.style.color = "red";
    return false;
  } */

}