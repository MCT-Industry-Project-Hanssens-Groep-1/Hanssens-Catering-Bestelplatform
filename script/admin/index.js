var db = firebase.firestore()

document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            window.location.replace("/school/login")
        } else if (user) {
            db.collection('users').doc(user.uid).get().then(doc => {
                if(doc.data() !== undefined) {
                    if(doc.data().role == "hanssens") {
                    window.location.replace("/school/bestellingen");
                    }
                    else if(doc.data().role == "school") {
                    window.location.replace("/school/leerlingen");
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