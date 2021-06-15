var userData;

var modal = document.getElementById("modal");

openModal = () => {
    modal.style.transform = "translate(0)";
    modal.style.opacity = "1";
}

closeModal = () => {
    modal.style.transform = "translate(9999px)";
    modal.style.opacity = "0";
    var errorText = document.querySelector('.js-error');
    errorText.style.opacity = "0";

    var elements = document.getElementsByTagName("input");
    for (var ii=0; ii < elements.length; ii++) {
      if (elements[ii].type == "text") {
        elements[ii].value = "";
      }else if (elements[ii].type == "password") {
        elements[ii].value = "";
      }
    }
}

window.onclick = function(event) {
    if (event.target == modal) {
      closeModal();
    }
  }

changePassword = () => {
    firebase.auth().sendPasswordResetEmail(userData.email)
        .then(() => {
            showNotification(`E-mail verzonden naar ${userData.email}`, null);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
        });
}

changeEmail = () => {
    var currentEmail = document.getElementById('currentEmailField').value;
    var password = document.getElementById('passwordField').value;
    var email = document.getElementById('emailField').value;
    var errorText = document.querySelector('.js-error');

    var cred = firebase.auth.EmailAuthProvider.credential(
      currentEmail, password
    );
    userData.reauthenticateWithCredential(cred).then(() => {
      userData.updateEmail(email).then(() => {
        getEmail(email);
        closeModal();
        }).catch((error) => {
          errorText.innerText = "Nieuw e-mailadres is verkeerd of bestaat al!"
          errorText.style.opacity = "100";
        });
    }).catch((error) => {
      errorText.innerText = "Gegevens verkeerd ingevuld!"
      errorText.style.opacity = "100";
    });
}

getEmail = (email) => {
    let emailHTML = document.querySelector('.js-email');
    let htmlString = `<h2>${email}</h2>
    <i class="material-icons" onclick="openModal()">edit</i>`
  
    emailHTML.innerHTML = htmlString;
  }

  logout = () => {
    firebase.auth().signOut();
  }

document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
          window.location.replace("/login")
      } else if (user) {
          userData = user;
          getEmail(user.email);
      }
    });
  });