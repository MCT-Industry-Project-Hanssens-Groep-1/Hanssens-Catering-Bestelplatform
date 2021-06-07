login = () => {
    var userEmail = document.getElementById("emailField").value;
    var userPassword = document.getElementById("passwordField").value;
    var errorText = document.querySelector('.js-error');

    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      window.location.replace("/school")
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      if (errorCode == 'auth/invalid-email') {
        errorText.innerText = "Ongeldig e-mailadres!"
      } else if (errorCode == 'auth/user-disabled') {
        errorText.innerText = "Deze gebruiker is uitgeschakeld!"
      } else if (errorCode == 'auth/user-not-found') {
        errorText.innerText = "Gebruiker bestaat niet!"
      } else if (errorCode == 'auth/wrong-password') {
        errorText.innerText = "E-mailadres of wachtwoord is ongeldig."
      }
      errorText.style.opacity = "100";
    });
}

document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().signOut();
});