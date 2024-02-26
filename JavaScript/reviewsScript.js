// Function to create a review card
function createReviewCard(review, meal) {
  const cardElement = document.createElement("div")
  cardElement.classList.add("col", "mb-4")
  cardElement.innerHTML = `
      <div class="card h-100 shadow" style="background-color: #f1da86; border-radius: 15px">
        <div class="card-body justify-content-centre" style="background-color: #; border-radius: 15px">
        <img src="${meal.strMealThumb}" class="card-img-top" style="width: 90%; height: auto; object-fit: cover; display: block; margin: auto; margin-top: 25px; border-radius: 15%;" alt="${meal.strMeal}">
        <h5 class="card-title" style="padding-top: 10px; padding-left: 20px">${meal.strMeal}</h5>
          <p class="card-text">Preparation date: ${review.reviewDate}</p>
        </div>
      </div>
    `

  const difficultyRating = createStarRating(review.difficultyRating)
  const tasteRating = createStarRating(review.tasteRating)
  const difficultyRow = document.createElement("div")
  difficultyRow.className = "d-flex align-items-center"
  difficultyRow.innerHTML = '<p class="mb-0 mr-2">Difficulty:</p>'
  difficultyRow.appendChild(difficultyRating)
  const tasteRow = document.createElement("div")
  tasteRow.className = "d-flex align-items-center"
  tasteRow.innerHTML = '<p class="mb-0 mr-2">Taste:</p>'
  tasteRow.appendChild(tasteRating)
  cardElement.querySelector(".card-body").appendChild(difficultyRow)
  cardElement.querySelector(".card-body").appendChild(tasteRow)
  const deleteButton = document.createElement("button")
  deleteButton.textContent = "Delete Review"
  deleteButton.className = "btn btn-danger"
  deleteButton.addEventListener("click", () => deleteReview(review))

  cardElement.querySelector(".card-body").appendChild(deleteButton)
  return cardElement
}

// Function to create a star rating element
function createStarRating(rating) {
  const ratingElement = document.createElement("div")
  ratingElement.className = "rating"
  ratingElement.style.marginBottom = "10px"
  ratingElement.style.marginLeft = "20px"
  for (let i = 1; i <= 5; i++) {
    const icon = document.createElement("i")
    icon.className = `bi-star${i <= rating ? "-fill" : ""}`
    icon.style.marginRight = "5px"
    icon.style.fontSize = "1.5rem"
    ratingElement.appendChild(icon)
  }
  return ratingElement
}

// fetch reviews by userName
function fetchReviews() {
  const loggedUser = sessionStorage.getItem("loggedUser")
  const reviews = JSON.parse(localStorage.getItem("reviews"))
  const mealReviews = reviews.filter((review) => review.username === loggedUser)
  return mealReviews
}

// Function to display meal by ID
function fetchMealById(mealId) {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  return fetch(url)
    .then((response) => response.json())
    .then((data) => data.meals[0])
    .catch((error) => console.error(`Error fetching meal by ID ${mealId}:`, error))
}

// display reviews
async function displayReviews() {
  const reviewsRow = document.getElementById("reviewsRow")
  const reviews = await fetchReviews()

  const meals = await Promise.all(reviews.map((review) => fetchMealById(review.mealId)))

  meals.forEach((meal, index) => {
    const reviewCard = createReviewCard(reviews[index], meal)
    reviewsRow.appendChild(reviewCard)
  })
}

//function to delete the review
function deleteReview(review) {
  console.log(review)
  const reviews = JSON.parse(localStorage.getItem("reviews"))
  const updatedReviews = reviews.filter(
    (r) => r.id !== review.id)
  console.log(updatedReviews)
  localStorage.setItem("reviews", JSON.stringify(updatedReviews))
  location.reload()
}

window.onload = () => {
  displayReviews()
}
