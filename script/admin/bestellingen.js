logout = () => {
    firebase.auth().signOut();
}

document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged((user) => {
    if (user) {
            if(sessionStorage.getItem('role') == "hanssens") {
                window.location.replace('/admin/scholen');
            }
        }
    });
});