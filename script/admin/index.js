var db = firebase.firestore()

document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            window.location.replace("/admin/login")
        } else if (user) {
            db.collection('users').doc(user.uid).get().then(doc => {
                if(doc.data() !== undefined) {
                    if(doc.data().role == "hanssens") {
                        sessionStorage.setItem('role', 'hanssens');
                        window.location.replace("/admin/scholen");
                    }
                    else if(doc.data().role == "school") {
                        sessionStorage.setItem('role', 'school');
                        window.location.replace("/admin/leerlingen");
                    } else {
                        firebase.auth().signOut();
                    }
                } else {
                    firebase.auth().signOut();
                }
            })
        }
    });
});