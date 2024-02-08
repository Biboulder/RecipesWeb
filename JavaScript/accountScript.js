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
  //sessionStorage.clear("favDish")
  window.location.href = "/HTML/signUp.html"
}
