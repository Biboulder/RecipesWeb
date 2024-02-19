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

// Make an HTTP GET request to fetch categories data
function fetchCategories() {
  const url = "https://www.themealdb.com/api/json/v1/1/categories.php"
  return fetch(url)
    .then((response) => response.json())
    .then((data) => data.categories)
    .catch((error) => console.error("Error fetching categories:", error))
}

// Function to fetch a single random meal
function fetchRandomMeal() {
  const url = "https://www.themealdb.com/api/json/v1/1/random.php"
  return fetch(url)
    .then((response) => response.json())
    .then((data) => data.meals[0])
    .catch((error) => console.error("Error fetching random meal:", error))
}

// Function to fetch 12 random meals
function fetchRandomMeals(n) {
  const promises = Array(n).fill().map(fetchRandomMeal)
  return Promise.all(promises)
}

// Function to fetch meals by category
function fetchMealsByCategory(category) {
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    })
    .then((data) => {
      console.log(data.meals)
      // Create an array of promises, one for each fetch
      const fetchPromises = data.meals.map((meal) => {
        return fetchMealById(meal.idMeal)
      })
      console.log(fetchPromises)
      // Wait for all the fetches to complete before returning the meals
      return Promise.all(fetchPromises)
    })
    .catch((error) => {
      console.error(`Error fetching meals for category ${category}:`, error)
    })
}

// Function to fetch meal by name
function fetchMealByNames(mealName) {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`
  return fetch(url)
    .then((response) => response.json())
    .then((data) => data.meals)
    .catch((error) => console.error(`Error fetching meal by name ${mealName}:`, error))
}

// Function to display meal by ID
function fetchMealById(mealId) {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  return fetch(url)
    .then((response) => response.json())
    .then((data) => data.meals[0])
    .catch((error) => console.error(`Error fetching meal by ID ${mealId}:`, error))
}

// Function to fetch reviews
function fetchReviews(mealId) {
  const reviews = JSON.parse(localStorage.getItem('reviews'));
  const mealReviews = reviews.filter(review => review.mealId === mealId);
  return mealReviews;
}

// Function to fetch notes
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


// Function to search meal by name
function searchMeal() {
  const mealName = document.getElementById("search input").value
  document.getElementById("search input").value = ""
  fetchMealByNames(mealName).then((meals) => {
    if (meals === null) {
      displayAlert()
      return
    }
    const mealCardsRow = document.getElementById("mealCardsRow")
    mealCardsRow.innerHTML = ""
    meals.forEach((meal) => {
      const card = createMealCard(meal)
      mealCardsRow.appendChild(card)
    })
  })
}

function displayAlert() {
  const alert = document.getElementById("mealCardsRow")
  alert.innerHTML = `
    <div class="container justify-content-centre" style="padding-top: 200px; text-align: centre;">
        <h5>No meals found, please retry</h5>
    </div>
  `
}

function displayRandomCards() {
  fetchRandomMeals(12).then((meals) => {
    const mealCardsRow = document.getElementById("mealCardsRow")
    mealCardsRow.innerHTML = ""
    meals.forEach((meal) => {
      const card = createMealCard(meal)
      mealCardsRow.appendChild(card)
    })
  })
}

// Function to display meal cards on the page
async function displayMealCategoryCards(category) {
  fetchMealsByCategory(category).then((meals) => {
    const mealCardsRow = document.getElementById("mealCardsRow")
    mealCardsRow.innerHTML = ""
    meals.forEach((meal) => {
      const card = createMealCard(meal)
      mealCardsRow.appendChild(card)
    })
  })
}

// Function to create buttons for each category
function createCategoryButtons(categories) {
  const buttonsContainer = document.getElementById("categoryButtons")
  categories.forEach((category) => {
    const button = document.createElement("button")
    button.textContent = category.strCategory
    button.className = "btn btn-lg mx-1 my-1"
    button.style.backgroundColor = "#8DB87C"
    button.style.color = "white"
    button.addEventListener("click", () => {
      // Make a request to the API with the clicked category
      displayMealCategoryCards(category.strCategory)
    })
    buttonsContainer.appendChild(button)
  })
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
  const reviewsRow = document.getElementById("reviewsRow")
  mealName.textContent = meal.strMeal
  // Save the meal ID in a data-* attribute
  mealName.dataset.mealId = meal.idMeal
  mealImage.src = meal.strMealThumb
  mealInstructions.innerHTML = meal.strInstructions
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
  reviewsRow.innerHTML = ""
  fetchReviews(meal.idMeal).forEach((review) => {

    const reviewCard = createReviewCard(review)
    reviewsRow.appendChild(reviewCard)
  })
  if (reviewsRow.hasChildNodes()) {
    document.getElementById("noReviews").innerHTML = ""
  } else {
    document.getElementById("noReviews").innerHTML = "No reviews yet, be the first to review this meal!"
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
      notes = JSON.parse(localStorage.getItem("notes"))
      notes = notes.filter(note => note.mealId !== mealNote.mealId || note.userName !== mealNote.userName);
      localStorage.setItem("notes", JSON.stringify(notes))
    }
  } else {
    loggedUser.savedMeals.push(mealId)
    mealButton.textContent = "Unsave"
  }
  localStorage.setItem('users', JSON.stringify(users));
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

// function to save a review
function saveReview() {
  const reviewDate = document.getElementById('reviewDate').value;
  const difficultyRating = Array.from(document.querySelectorAll('input[name="difficulty"]')).find(radio => radio.checked).value;
  const tasteRating = Array.from(document.querySelectorAll('input[name="taste"]')).find(radio => radio.checked).value;
  const username = sessionStorage.getItem('loggedUser');
  const mealId = document.getElementById('mealName').dataset.mealId;
  const review = {
    username,
    mealId,
    reviewDate,
    difficultyRating,
    tasteRating
  };
  let reviews = JSON.parse(localStorage.getItem('reviews'));
  if (!reviews) {
    reviews = [];
  }
  reviews.push(review);
  localStorage.setItem('reviews', JSON.stringify(reviews));
  //location.reload();
}

// Function to create a star rating element
function createStarRating(rating) {
  const ratingElement = document.createElement('div');
  ratingElement.className = 'rating';
  ratingElement.style.marginBottom = '10px';
  ratingElement.style.marginLeft = '20px';
  for (let i = 1; i <= 5; i++) {
    const icon = document.createElement('i');
    icon.className = `bi-star${i <= rating ? '-fill' : ''}`;
    icon.style.marginRight = '5px';
    icon.style.fontSize = '1.5rem';
    ratingElement.appendChild(icon);
  }
  return ratingElement;
}

// Function to create a review card
function createReviewCard(review) {
  const cardElement = document.createElement('div');
  cardElement.classList.add('col', 'mb-4');
  cardElement.innerHTML = `
    <div class="card h-100 shadow" style="background-color: #D4E8C1; border-radius: 15px">
      <div class="card-body" style="background-color: #D4E8C1; border-radius: 15px">
        <h4 class="card-title">${review.username}</h4>
        <p class="card-text">Preparation date: ${review.reviewDate}</p>
      </div>
    </div>
  `;

  const difficultyRating = createStarRating(review.difficultyRating);
  const tasteRating = createStarRating(review.tasteRating);
  const difficultyRow = document.createElement('div');
  difficultyRow.className = 'd-flex align-items-center';
  difficultyRow.innerHTML = '<p class="mb-0 mr-2">Difficulty:</p>';
  difficultyRow.appendChild(difficultyRating);
  const tasteRow = document.createElement('div');
  tasteRow.className = 'd-flex align-items-center';
  tasteRow.innerHTML = '<p class="mb-0 mr-2">Taste:</p>';
  tasteRow.appendChild(tasteRating);
  cardElement.querySelector('.card-body').appendChild(difficultyRow);
  cardElement.querySelector('.card-body').appendChild(tasteRow);

  return cardElement;
}

// Fetch categories and create buttons when the page loads
window.onload = () => {
  fetchCategories().then((categories) => {
    createCategoryButtons(categories)
    displayRandomCards()
  })
}
