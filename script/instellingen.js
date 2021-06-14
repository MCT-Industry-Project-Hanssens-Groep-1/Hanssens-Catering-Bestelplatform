var userData;

var modal = document.getElementById("modal");

openModal = () => {
    modal.style.transform = "translate(0)";
    modal.style.opacity = "1";
}

closeModal = () => {
    modal.style.transform = "translate(9999px)";
    modal.style.opacity = "0";

    var elements = document.getElementsByTagName("input");
    for (var ii=0; ii < elements.length; ii++) {
      if (elements[ii].type == "text") {
        elements[ii].value = "";
      }
    }
}

window.onclick = function(event) {
    if (event.target == modal) {
      closeModal();
    }
  }

openNotification = () => {
    var notification = document.querySelector('.js-notification');
    notification.classList.remove("hide");
    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.add("hide");
    }, 5000)
}

closeNotification = () => {
    var notification = document.querySelector('.js-notification');
    notification.classList.add("hide");
}

changePassword = () => {
    openNotification();
    firebase.auth().sendPasswordResetEmail(userData.email)
        .then(() => {
            // Password reset email sent!
            // ..
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
        });
}

changeEmail = () => {
    email = document.getElementById('emailField').value;
    userData.updateEmail(email).then(() => {
        getEmail(email);
        closeModal();
      }).catch((error) => {
        // An error occurred
        // ...
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