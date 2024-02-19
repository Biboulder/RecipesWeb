//reads from local the string and parse it to an object
function read_object_from_local_storage(key) {
  var item = window.localStorage.getItem(key)
  return JSON.parse(item)
}

// Function to display saved meals
function displaySavedMeals() {
  const userName = sessionStorage.getItem("loggedUser")
  const users = read_object_from_local_storage("users")
  const loggedUser = users.find((user) => user.username === userName)
  const savedMeals = loggedUser.savedMeals
  const mealCardsRow = document.getElementById("mealCardsRow")
  mealCardsRow.innerHTML = ""
  if (savedMeals.length === 0) {
    displayAlert()
  } else {
    savedMeals.forEach((mealId) => {
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then((response) => response.json())
        .then((data) => {
          const meal = data.meals[0]
          mealCardsRow.appendChild(createMealCard(meal))
        })
    })
  }
}

// Function to display an alert
function displayAlert() {
  const alert = document.getElementById("mealCardsRow")
  alert.innerHTML = `
      <div class="container justify-content-centre" style="padding-top: 200px; text-align: centre;">
          <h5>You don't have any saved meals</h5>
      </div>
    `
}

// Function to create a meal card
function createMealCard(meal) {
  const cardElement = document.createElement("div")
  cardElement.classList.add("col", "mb-4")
  cardElement.innerHTML = `
        <div class="card h-100 shadow" style="background-color: #f1da86; border-radius: 15px" data-bs-toggle="modal" data-bs-target="#mealInfo">
          <img src="${meal.strMealThumb}" class="card-img-top" style="width: 80%; height: auto; object-fit: cover; display: block; margin: auto; margin-top: 25px; border-radius: 15%;" alt="${meal.strMeal}">
          <div class="card-body" style="background-color: #f1da86; border-radius: 15px">
            <h5 class="card-title">${meal.strMeal}</h5>
            <p class="card-text">${meal.strArea}</p>
          </div>
        </div>
    `
  cardElement.addEventListener("click", () => {
    displayMealInfo(meal)
  })
  return cardElement
}

// Function to display meal info in a modal
function displayMealInfo(meal) {
  textButton(meal.idMeal)
  const mealName = document.getElementById("mealName")
  const mealImage = document.getElementById("mealImage")
  const mealInstructions = document.getElementById("mealInstructions")
  const mealIngredients = document.getElementById("mealIngredients")
  const noteText = document.getElementById("note")
  mealName.textContent = meal.strMeal
  // Save the meal ID in a data-* attribute
  mealName.dataset.mealId = meal.idMeal
  mealImage.src = meal.strMealThumb
  mealInstructions.textContent = meal.strInstructions
  mealIngredients.innerHTML = ""
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]
    if (!ingredient || !measure) {
      break
    }
    const listItem = document.createElement("li")
    listItem.textContent = `${ingredient} - ${measure}`
    mealIngredients.appendChild(listItem)
  }
  const note = fetchNote(meal.idMeal)
  if (!note) {
    noteText.value = ""
  } else {
    noteText.value = note.note
  }
}

// Function to save meals
function saveMeal() {
  const mealButton = document.getElementById("mealButton")
  const userName = sessionStorage.getItem("loggedUser")
  const users = read_object_from_local_storage("users")
  const loggedUser = users.find((user) => user.username === userName)
  const mealId = mealName.dataset.mealId
  if (loggedUser.savedMeals.includes(mealId)) {
    loggedUser.savedMeals = loggedUser.savedMeals.filter((id) => id !== mealId)
    mealButton.textContent = "Save"
    const mealNote = fetchNote(mealId);
    if (mealNote) {
      let notes = JSON.parse(localStorage.getItem("notes"))
      notes = notes.filter(note => note.mealId !== mealNote.mealId || note.userName !== mealNote.userName);
      localStorage.setItem("notes", JSON.stringify(notes))
    }
    location.reload()
  } else {
    loggedUser.savedMeals.push(mealId)
    mealButton.textContent = "Unsave"
    location.reload()
  }
  localStorage.setItem("users", JSON.stringify(users))
  location.reload()
}

// Function to change the text of the button
function textButton(mealId) {
  const userName = sessionStorage.getItem("loggedUser")
  const users = read_object_from_local_storage("users")
  const loggedUser = users.find((user) => user.username === userName)
  const mealButton = document.getElementById("mealButton")
  if (loggedUser.savedMeals.includes(mealId)) {
    mealButton.textContent = "Unsave"
  } else {
    mealButton.textContent = "Save"
  }
}

// function to save the note
function saveNote() {
  const mealId = mealName.dataset.mealId
  const note = document.getElementById("note").value
  const userName = sessionStorage.getItem("loggedUser")
  const noteObject = {
    userName,
    mealId,
    note,
  }
  let notes = JSON.parse(localStorage.getItem("notes"))
  if (!notes) {
    notes = []
  }
  const existingNoteIndex = notes.findIndex((n) => n.mealId === mealId && n.userName === userName)
  if (existingNoteIndex !== -1) {
    notes[existingNoteIndex] = noteObject
  } else {
    notes.push(noteObject)
  }
  localStorage.setItem("notes", JSON.stringify(notes))
  location.reload()
}

//function to fetch the notes
function fetchNote(mealID) {
  const userName = sessionStorage.getItem("loggedUser")
  let notes = JSON.parse(localStorage.getItem("notes"))
  if (!notes) {
    notes = []
  }
  const mealNote = notes.filter((note) => note.mealId === mealID && note.userName === userName)
  if (mealNote.length === 0) {
    return null
  }
  return mealNote[0]
}

window.onload = () => {
  displaySavedMeals()
}
