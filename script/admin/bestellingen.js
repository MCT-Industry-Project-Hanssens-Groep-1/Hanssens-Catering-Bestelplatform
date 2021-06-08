logout = () => {
    firebase.auth().signOut();
}

document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        }
      });
});