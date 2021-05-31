var db = firebase.firestore()
var modal = document.getElementById("profielen-modal");

openModal = () => {
    modal.style.display = "block";
}

closeModal = () => {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

addProfiel = () => {

}

firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        window.location.replace("/login")
    } else if (user) {
        console.log(user);
    }
  });