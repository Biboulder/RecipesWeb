const BaseUrl = "https://www.themealdb.com/api/json/v1/1/";

//  HTTP request
function get_url(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "json";
  xhr.onload = function () {
    var status = xhr.status;
    callback(status, xhr.response);
  };
  xhr.send();
}

// Search the meal by its name
function searchByName(mealName) {
  return BaseUrl + "search.php?s=" + mealName;
}

var mealName = "Arrabiata";

get_url(searchByName(mealName), function (status, data) {
  console.log(data.meals[0]);
}); 