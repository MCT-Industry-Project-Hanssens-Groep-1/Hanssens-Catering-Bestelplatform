signup = () => {
    var userEmail = document.getElementById("emailField").value;
    var userPassword = document.getElementById("passwordField").value;
    var userNaam = document.getElementById("naamField").value;
    var userVoornaam = document.getElementById("voornaamField").value;
    var errorText = document.querySelector('.js-error');
    
    if(!userNaam == "" && !userVoornaam == "") {
      console.log("yes");
      firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword)
        .then((userCredential) => {
            var user = userCredential.user;
            user.updateProfile({
              displayName: `${userNaam.charAt(0).toUpperCase() + userNaam.slice(1)}` + " " + `${userVoornaam.charAt(0).toUpperCase() + userVoornaam.slice(1)}`,
            })
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
            if (errorCode == 'auth/invalid-email') {
                errorText.innerText = "Ongeldig e-mailadres!"
              } else if (errorCode == 'auth/email-already-in-use') {
                errorText.innerText = "Gebruiker bestaat al!"
              } else if (errorCode == 'auth/weak-password') {
                errorText.innerText = "Wachtwoord moet minimum 6 karakters bevatten!"
              }
            errorText.style.opacity = "100";
        });
    }
    else {
      errorText.innerText = "Alle velden moeten ingevuld zijn!"
      errorText.style.opacity = "100";
    }
}

document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          window.location.replace("/")
        }
      });
});