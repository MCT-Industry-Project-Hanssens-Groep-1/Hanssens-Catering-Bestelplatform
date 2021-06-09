var db = firebase.firestore();

setVerified = (rijksregisternummer) => {
    db.collection('kinderen')
    .doc(rijksregisternummer)
    .update({
        status: "verified"
    });
}

getLeerlingen = (user) => {
    let unverifiedHTML = document.querySelector('.js-unverified');
    let verifiedHTML = document.querySelector('.js-verified');

    db.collection('kinderen')
    .where("school", "==", user.displayName)
    .onSnapshot((querySnapshot) => {
        let htmlStringUnverified = `<tr>
            <th>Naam</th>
            <th>Voornaam</th>  
            <th>Leerjaar</th>
            <th></th>
            <th></th>
            <th></th>
        </tr>`;

        let htmlStringVerified = `<tr>
            <th>Naam</th>
            <th>Voornaam</th>
            <th>Leerjaar</th>
            <th></th>
        </tr>`;

        querySnapshot.forEach((doc) => {
            if(doc.data().status == "unverified") {
                htmlStringUnverified += `<tr>
            <td>${doc.data().familienaam}</td>
            <td>${doc.data().voornaam}</td>
            <td>${doc.data().leerjaar}</td>
            <td class="c-table-icons">
                <i onclick="setVerified('${doc.data().rijksregisternummer}')" class="material-icons">done</i>
            </td>
            <td class="c-table-icons">
                <i class="material-icons">edit</i>
            </td>
            <td class="c-table-icons">
                <i class="material-icons">delete</i>
            </td>
        </tr>`
            } else if (doc.data().status == "verified") {
                htmlStringVerified += `<tr>
                <td>${doc.data().familienaam}</td>
                <td>${doc.data().voornaam}</td>
                <td>${doc.data().leerjaar}</td>
                <td class="c-table-icons">
                    <i class="material-icons">edit</i>
                </td>
            </tr>`
            }
        })
        unverifiedHTML.innerHTML = htmlStringUnverified;
        verifiedHTML.innerHTML = htmlStringVerified;
    })
}

logout = () => {
    firebase.auth().signOut();
}

document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            if(sessionStorage.getItem('role') == "hanssens") {
                window.location.replace('/admin/scholen');
            }
            getLeerlingen(user);
        }
    });
});