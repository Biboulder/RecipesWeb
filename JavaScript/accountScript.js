function getLoggedUser() {
    var loggedUser = sessionStorage.getItem("loggedUser");
    if (loggedUser != null) {
        var users = read_object_from_local_storage('users');
        for (var i = 0; i < users.length; i++) {
            if (users[i].username == loggedUser) {
                console.log(users[i])
                document.getElementById("username").innerHTML += users[i].username;
                document.getElementById("email").innerHTML += users[i].email;
                break;
            }
        }
    }
}

//reads from local the string and parse it to an object
function read_object_from_local_storage(key) {
    var item = window.localStorage.getItem(key);
    return JSON.parse(item);
  }