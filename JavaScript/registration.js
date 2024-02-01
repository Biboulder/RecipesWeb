function checkRegistration() {
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

  const password = document.getElementById("password").value;
  if (!lengthRegex.test(password)) {
    pswdError.innerHTML += "Password is too short or too long.<br>";
    result = false;
  }

  if (!capitalLetterRegex.test(password)) {
    pswdError.innerHTML += "Password must contain one capital letter.<br>";
    result = false;
  }

  if (!numberRegex.test(password)) {
    pswdError.innerHTML += "Password must contain at least one number.<br>";
    result = false;
  }

  if (!specialCharacterRegex.test(password)) {
    pswdError.innerHTML +=
      "Password must contain at least one special character (!?-_).<br>";
    result = false;
  }

  if (spaceRegex.test(password)) {
    pswdError.innerHTML += "Password cannot contain spaces.<br>";
    result = false;
  }

  if (!specialCharacterCheckRegex.test(password)) {
    pswdError.innerHTML +=
      "Password cannot contain any other types of special characters.";
  }

  // Confirm password error
  const confirmPassword = document.getElementById("confirmPassword").value;

  var checkPswdError = document.getElementById("checkPswdError");
  checkPswdError.innerHTML = "";

  if (password !== confirmPassword) {
    checkPswdError.innerHTML += "Passwords do not match.<br>";
    result = false;
  }

  // Username error
  var usernameErroor = document.getElementById("usernameError");
  usernameErroor.innerHTML = "";
  const username = document.getElementById("username").value;

  const lengthusrRegex = /^.{5,15}$/;
  if (!lengthusrRegex.test(username)) {
    usernameErroor.innerHTML += "Username is too short or too long.<br>";
    result = false;
  }

  const regexUsername = /^[a-z0-9\s]+$/i;
  if (!username.match(regexUsername)) {
    usernameErroor.innerHTML +=
      "Username cannot contain special characters.<br>";
    result = false;
  }

  var countNum = username.replace(/\D/g, "").length;
  if (countNum != 2) {
    usernameErroor.innerHTML +=
      "Username must contain exactly two numbers.<br>";
    result = false;
  }

  // Email error
  var email = document.getElementById("email").value;
  var emailError = document.getElementById("emailError");
  var regexEmail = /^\S+@\S+\.\S+/;
  if (!email.match(regexEmail)) {
    emailError.innerHTML += "Email not valid.<br>";
    result = false;
  }

  return result;
}
