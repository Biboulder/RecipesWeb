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
  const url = 'https://www.themealdb.com/api/json/v1/1/random.php';
  return fetch(url)
    .then((response) => response.json())
    .then((data) => data.meals[0])
    .catch((error) => console.error('Error fetching random meal:', error));
}

// Function to fetch 12 random meals
function fetchRandomMeals(n) {
  const promises = Array(n).fill().map(fetchRandomMeal);
  return Promise.all(promises);
}

function fetchMealsByCategory(category) {
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
        return data.meals;
    })
    .catch((error) => { console.error(`Error fetching meals for category ${category}:`, error);});
}

function fectMealByNames(mealName) {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`
  return fetch(url)
    .then((response) => response.json())
    .then((data) => data.meals)
    .catch((error) => console.error(`Error fetching meal by name ${mealName}:`, error));
}

function searchMeal() {
  const mealName = document.getElementById("search input").value;
  fectMealByNames(mealName).then((meals) => {
    const mealCardsRow = document.getElementById("mealCardsRow");
    mealCardsRow.innerHTML = "";
    meals.forEach((meal) => {
      const card = createMealCard(meal);
      mealCardsRow.innerHTML += card;
    });
  });

}

function displayRandomCards() {
  fetchRandomMeals(12).then((meals) => {
    const mealCardsRow = document.getElementById("mealCardsRow");
    mealCardsRow.innerHTML = "";
    meals.forEach((meal) => {
      const card = createMealCard(meal);
      mealCardsRow.innerHTML += card;
    });
  });
}


// Function to display meal cards on the page
async function displayMealCategoryCards(category) {
  fetchMealsByCategory(category).then((meals) => {
    const mealCardsRow = document.getElementById("mealCardsRow")
    mealCardsRow.innerHTML = ""
    meals.forEach((meal) => {
      const card = createMealCard(meal)
      mealCardsRow.innerHTML += card
    });
  });
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
  const card = `
    <div class="col mb-4">
      <div class="card h-100 shadow" style="background-color: #F5D769; border-radius: 15px">
        <img src="${meal.strMealThumb}" class="card-img-top" style="width: 80%; height: auto; object-fit: cover; display: block; margin: auto; padding-top: 25px; border-radius: 15%;" alt="${meal.strMeal}">
        <div class="card-body" style="background-color: #F5D769; border-radius: 15px">
          <h5 class="card-title">${meal.strMeal}</h5>
          <p class="card-text">${meal.strArea}</p>
        </div>
      </div>
    </div>
  `
  return card
}


// Fetch categories and create buttons when the page loads
window.onload = () => {
  fetchCategories().then((categories) => {
    createCategoryButtons(categories);
    displayRandomCards();
  });
};
