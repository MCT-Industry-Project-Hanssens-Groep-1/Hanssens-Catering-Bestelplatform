login = () => {
    var userEmail = document.getElementById("emailField").value;
    var userPassword = document.getElementById("passwordField").value;
    var errorText = document.querySelector('.js-error');

    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...
      console.log(user);
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      errorText.innerText = `${errorMessage}`
      errorText.style.opacity = "100";
    });
}

document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          window.location.replace("/")
        }
      });
});