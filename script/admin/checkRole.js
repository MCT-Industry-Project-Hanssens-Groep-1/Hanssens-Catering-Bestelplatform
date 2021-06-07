var db = firebase.firestore()

const hanssensItems = document.querySelectorAll('.js-role-hanssens');
const schoolItems = document.querySelectorAll('.js-role-school');

const setupUI = (user) => {
    db.collection('users').doc(user.uid).get().then(doc => {
        if(doc.data().role == "hanssens") {
            hanssensItems.forEach(item => item.style.display = "block");
            schoolItems.forEach(item => item.style.display = "none");
        }
        else if(doc.data().role == "school") {
          hanssensItems.forEach(item => item.style.display = "none");
          schoolItems.forEach(item => item.style.display = "block");
      }
    })
}

document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
          window.location.replace("/school/login")
      } else if (user) {
        setupUI(user)
      }
    });
  });