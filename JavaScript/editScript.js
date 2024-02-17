//reads from local the string and parse it to an object
function read_object_from_local_storage(key) {
    var item = window.localStorage.getItem(key);
    return JSON.parse(item);
  }
  //converts the object to a string and save it in local
  function write_object_to_local_storage(obj, key) {
    var item = JSON.stringify(obj);
    window.localStorage.setItem(key, item);
  }

  favMeal = "";

  function checkEdit() {
    var result = true;
  
    // Password error
    var pswdError = document.getElementById("pswdError");
    pswdError.innerHTML = "";
    const lengthRegex = /^.{8,20}$/;
    const capitalLetterRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const specialCharacterRegex = /[!?_-]/;
    const spaceRegex = /\s/;
    const specialCharacterCheckRegex = /^[a-zA-Z0-9!?\-_]+$/;
  
    var passwordBox = document.getElementById("password");
    var password = passwordBox.value;
    var pswdBoxCheck = true;
    if (!lengthRegex.test(password)) {
      pswdError.innerHTML += "Password is too short or too long.<br>";
      result = false;
      pswdBoxCheck = false;
    }
  
    if (!capitalLetterRegex.test(password)) {
      pswdError.innerHTML += "Password must contain one capital letter.<br>";
      result = false;
    }
  
    if (!numberRegex.test(password)) {
      pswdError.innerHTML += "Password must contain at least one number.<br>";
      result = false;
      pswdBoxCheck = false;
    }
  
    if (!specialCharacterRegex.test(password)) {
      pswdError.innerHTML +=
        "Password must contain at least one special character (!?-_).<br>";
      result = false;
      pswdBoxCheck = false;
    }
  
    if (spaceRegex.test(password)) {
      pswdError.innerHTML += "Password cannot contain spaces.<br>";
      result = false;
      pswdBoxCheck = false;
    }
  
    if (!specialCharacterCheckRegex.test(password)) {
      pswdError.innerHTML +=
        "Password cannot contain any other types of special characters.";
      result = false;
      pswdBoxCheck = false;
    }
  
    // Username error
    var usernameBox = document.getElementById("username");
    var usernameErroor = document.getElementById("usernameError");
    usernameErroor.innerHTML = "";
    var username = usernameBox.value;
    var usernameBoxCheck = true;
  
    const lengthusrRegex = /^.{5,15}$/;
    if (!lengthusrRegex.test(username)) {
      usernameErroor.innerHTML += "Username is too short or too long.<br>";
      result = false;
      usernameBoxCheck = false;
    }
  
    const regexUsername = /^[a-z0-9\s]+$/i;
    if (!username.match(regexUsername)) {
      usernameErroor.innerHTML +=
        "Username not valid.<br>";
      result = false;
      usernameBoxCheck = false;
    }
  
    var countNum = username.replace(/\D/g, "").length;
    if (countNum < 1) {
      usernameErroor.innerHTML += "Username must contain at least one number.<br>";
      result = false;
      usernameBoxCheck = false;
    }
  
    // Email error
    var emailBox = document.getElementById("email");
    var email = emailBox.value;
    var emailError = document.getElementById("emailError");
    emailError.innerHTML = "";
    var regexEmail = /^\S+@\S+\.\S+/;
    var emailBoxCheck = true;
  
    if (!email.match(regexEmail)) {
      emailError.innerHTML += "Email not valid.<br>";
      result = false;
      emailBoxCheck = false;
    }
  
    // makes an array with all users except the one logged and retrive all the data of the logged user
    const loggedUsername = sessionStorage.getItem('loggedUser');
    var users = read_object_from_local_storage("users");
    const loggedUser = users.find(user => user.username === loggedUsername);
    var registeredusers = users.filter(function (single) { // without the logged user
      return single.username !== loggedUsername;
    });

    // checks doubles in usernames
    if (result == true) {
      usernameErroor.innerHTML = "";
      if (registeredusers != null) {
        for (i = 0; i < registeredusers.length; i++) {
          if (registeredusers[i].username == username) {
            usernameErroor.innerHTML += "Username already in use.<br>";
            result = false;
            usernameBoxCheck = false;
            break;
          }
        }
      }
    }
  
    // checks doubles in emails
    if (result == true) {
      emailError.innerHTML = "";
      if (registeredusers != null) {
        for (i = 0; i < registeredusers.length; i++) {
          if (registeredusers[i].email == email) {
            emailError.innerHTML = "Email already in use.<br>";
            result = false;
            emailBoxCheck = false;
            break;
          }
        }
      }
    }
  
    // username box turns red if wrong
    if (!usernameBoxCheck) {
      usernameBox.style.borderColor = "red";
    } else {
      usernameBox.style.borderColor = "";
    }
  
    // email box turns red if wrong
    if (!emailBoxCheck) {
      emailBox.style.borderColor = "red";
    } else {
      emailBox.style.borderColor = "";
    }
  
    // Password box turns red if wrong
    if (!pswdBoxCheck) {
      passwordBox.style.borderColor = "red";
    } else {
      passwordBox.style.borderColor = "";
    }
  
  
    //if all checks pass, then create the user e save in local
    if (result == true) {
      loggedUser.username = username;
      loggedUser.email = email;
      loggedUser.password = password;
      loggedUser.favMeal = favMeal;
      localStorage.setItem('users', JSON.stringify(users));
      sessionStorage.setItem('loggedUser', username);
    }
    return result;
  }
  
  // toggle password between invisible and visible.
  function toggle_Password() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }
  
  //saves the object by reference to the key, obeject can be any type
  function save_In_Local(key, obj) {
    if (read_object_from_local_storage(key) == null) {
      write_object_to_local_storage([], key);
    }
  
    var arr = read_object_from_local_storage(key);
    arr.push(obj);
  
    write_object_to_local_storage(arr, key);
  }

  // function to set the placeholder of the input fields
  function setPlaceholder() {
    const loggedUsername = sessionStorage.getItem('loggedUser');
    var users = read_object_from_local_storage("users");
    const loggedUser = users.find(user => user.username === loggedUsername);
    document.getElementById("username").value = loggedUser.username;
    document.getElementById("email").value = loggedUser.email;
    fetchMealById(loggedUser.favMeal).then((meal) => {
      document.getElementById("mealsNames").innerHTML = createMealCard(meal);
      favMeal = meal.idMeal;
    });
  }

  window.onload = () => {
    setPlaceholder();
  }

  // Function to search meal by name
function searchMeal() {
  const mealName = document.getElementById("search input").value;
  fetchMealByNames(mealName).then((meals) => {
    if (meals === null) {
      displayAlert();
      return;
    }
    const mealNamesList = document.getElementById("mealsNames");
    mealNamesList.innerHTML = "";
    const groupItem = document.createElement("ul");
    groupItem.classList.add("list-group");
    mealNamesList.appendChild(groupItem);
    meals.forEach((meal) => {
      const listItem = document.createElement("li");
      listItem.textContent = meal.strMeal;
      listItem.classList.add("list-group-item");
      listItem.classList.add("list-group-item-action");
      groupItem.appendChild(listItem);
      listItem.addEventListener("click", () => {
        favMeal = meal.idMeal;
        const card = createMealCard(meal);
        mealNamesList.innerHTML = card;
      });
    });
  });

}

// Function to fetch meal by name
function fetchMealByNames(mealName) {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`
  return fetch(url)
    .then((response) => response.json())
    .then((data) => data.meals)
    .catch((error) => console.error(`Error fetching meal by name ${mealName}:`, error));
}

// Function to display meal by ID
function fetchMealById(mealId) {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  return fetch(url)
    .then((response) => response.json())
    .then((data) => data.meals[0])
    .catch((error) => console.error(`Error fetching meal by ID ${mealId}:`, error))
}

// Function to create a meal card
function createMealCard(meal) {
  const card = `
    <div class="col mb-4">
      <div class="card h-100 shadow" style="background-color: #f1da86; border-radius: 15px">
        <img src="${meal.strMealThumb}" class="card-img-top" style="width: 80%; height: auto; object-fit: cover; display: block; margin: auto; margin-top: 25px; border-radius: 15px;" alt="${meal.strMeal}">
        <div class="card-body" style="background-color: #f1da86; border-radius: 15px">
          <h5 class="card-title">${meal.strMeal}</h5>
        </div>
      </div>
    </div>
  `
  return card
}

function displayAlert() {
  const alert = document.getElementById("mealsNames");
  alert.innerHTML = `
    <div class="container justify-content-centre" style="padding-top: 100px; text-align: centre">
        <h5>No meals found, please retry</h5>
    </div>
  `;
}