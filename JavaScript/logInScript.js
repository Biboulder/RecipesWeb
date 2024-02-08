function toggle_Password() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  function log_In() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    var users = read_object_from_local_storage('users');
    if(users != null) {
        for(i = 0; i < users.length; i++) {
            if((users[i].username == username) && (users[i].password == password)) {
                sessionStorage.setItem("loggedUser",users[i].username)
                return true;
            }
        }
    }

    document.getElementById("password").value = "";
    // var error = document.getElementById("error");
    // error.innerHTML = "Username and/or password not correct, retry<br>";
    return false;
}

//reads from local the string and parse it to an object
function read_object_from_local_storage(key) {
    var item = window.localStorage.getItem(key)
    return JSON.parse(item)
}
//converts the object to a string and save it in local
function write_object_to_local_storage(obj, key) {
    var item = JSON.stringify(obj)
    window.localStorage.setItem(key, item);
}