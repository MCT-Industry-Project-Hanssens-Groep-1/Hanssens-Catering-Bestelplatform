signup = () => {
    var userEmail = document.getElementById("emailField").value;
    var userPassword = document.getElementById("passwordField").value;

    firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword)
        .then((userCredential) => {
            var user = userCredential.user;
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
        });
}