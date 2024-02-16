function getLoggedUser() {
  var loggedUser = sessionStorage.getItem("loggedUser")
  if (loggedUser != null) {
    var users = read_object_from_local_storage("users")
    for (var i = 0; i < users.length; i++) {
      if (users[i].username == loggedUser) {
        document.getElementById("username").innerHTML += users[i].username
        document.getElementById("email").innerHTML += users[i].email
        break
      }
    }
  }
}

//reads from local the string and parse it to an object
function read_object_from_local_storage(key) {
  var item = window.localStorage.getItem(key)
  return JSON.parse(item)
}

//converts the object to a string and save it in local
function write_object_to_local_storage(obj, key) {
    var item = JSON.stringify(obj);
    window.localStorage.setItem(key, item);
  }
  

// delete account logged in from local storage
function delete_Acc() {
var loggedUser = sessionStorage.getItem("loggedUser")
  var pre_Cont_Local = read_object_from_local_storage("users")
  var cont_Local = pre_Cont_Local.filter(function (us) {
    return us.username !== loggedUser
  })

  var exchanges_List = read_object_from_local_storage("exchanges")
  if (exchanges_List != null) {
    var exchange_New = exchanges_List.filter(function (us) {
      return us.username !== loggedUser
    })
    write_object_to_local_storage(exchange_New, "exchanges")
  }

  write_object_to_local_storage([], "users")
  write_object_to_local_storage(cont_Local, "users")
  sessionStorage.clear("loggedUser")
  window.location.href = "/HTML/signUp.html"
}

// Function to display favourite meal 
function displayFavouriteMeal() {
  var userName = sessionStorage.getItem("loggedUser")
  var users = read_object_from_local_storage("users")
  var loggedUser = users.find(function (user) {
    return user.username === userName
  })
  var mealContainer = document.getElementById("favouriteMeal")
  mealContainer.innerHTML = ""
  fetchMealById(loggedUser.favMeal).then((meal) => {
    mealContainer.innerHTML = createMealCard(meal)
  })
  }

// Function to create a meal card
function createMealCard(meal) {
  const card = `
    <div class="col mb-4">
      <div class="card h-100 shadow" style="background-color: #f1da86; border-radius: 15px">
        <img src="${meal.strMealThumb}" class="card-img-top" style="width: 80%; height: auto; object-fit: cover; display: block; margin: auto; margin-top: 25px; border-radius: 15px;" alt="${meal.strMeal}">
        <div class="card-body" style="background-color: #f1da86; border-radius: 15px">
          <h4 class="card-title">${meal.strMeal}</h4>
        </div>
      </div>
    </div>
  `
  return card
}

// Function to display meal by ID
function fetchMealById(mealId) {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  return fetch(url)
    .then((response) => response.json())
    .then((data) => data.meals[0])
    .catch((error) => console.error(`Error fetching meal by ID ${mealId}:`, error))
}

window.onload = () =>{
displayFavouriteMeal()
}