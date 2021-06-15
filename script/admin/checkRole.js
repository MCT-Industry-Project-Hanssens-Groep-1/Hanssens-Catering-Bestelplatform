var db = firebase.firestore();

const authorize = (user) => {
  if(localStorage.getItem('role') == "hanssens") {
    console.log("Authorized as Hanssens");
  } else if(localStorage.getItem('role') == "school") {
    console.log("Authorized as Hanssens");
  } else {
    firebase.auth().signOut();
  }
}

document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
          window.location.replace("/admin/login")
      } else if (user) {
        authorize(user)
      }
    });
  });