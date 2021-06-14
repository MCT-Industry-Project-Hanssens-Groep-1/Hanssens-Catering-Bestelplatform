var db = firebase.firestore();

var unverifiedData = [], verifiedData = [];

setVerified = (rijksregisternummer) => {
    db.collection('kinderen')
    .doc(rijksregisternummer)
    .update({
        status: "verified"
    });
}

getLeerlingen = (user) => {
    db.collection('kinderen')
    .where("school", "==", user.displayName)
    .onSnapshot((querySnapshot) => {
        verifiedData = []
        unverifiedData = []
        querySnapshot.forEach((doc) => {
            if(doc.data().status == "unverified") {
                unverifiedData.push(doc.data());
            } else if (doc.data().status == "verified") {
                verifiedData.push(doc.data());
            }
        })
        showLeerlingen();
    })
}

showLeerlingen = () => {
    let unverifiedHTML = document.querySelector('.js-unverified');
    let verifiedHTML = document.querySelector('.js-verified');
    let htmlStringUnverified = "<table><tr><th>Geen kinderen om te accepteren</th></tr></table>";
    let htmlStringVerified = "<table><tr><th>Geen geaccepteerde kinderen</th></tr></table>";

    if(unverifiedData.length > 0) {
        htmlStringUnverified = `<table>
        <tr>
        <th>Naam</th>
        <th>Voornaam</th>  
        <th>Leerjaar</th>
        <th></th>
        <th></th>
        <th></th>
        </tr>`;

        for(var key in unverifiedData) {
            var leerling = unverifiedData[key];
            htmlStringUnverified += `<tr>
                <td>${leerling.familienaam}</td>
                <td>${leerling.voornaam}</td>
                <td>${leerling.leerjaar}</td>
                <td class="c-table-icons">
                    <i onclick="setVerified('${leerling.rijksregisternummer}')" class="material-icons">done</i>
                </td>
                <td class="c-table-icons">
                    <i class="material-icons">edit</i>
                </td>
                <td class="c-table-icons">
                    <i class="material-icons">delete</i>
                </td>
            </tr>`
        }

        htmlStringUnverified += `</table>`;
    }

    if(verifiedData.length > 0) {
        htmlStringVerified = `<table>
        <tr>
        <th>Naam</th>
        <th>Voornaam</th>
        <th>Leerjaar</th>
        <th></th>
    </tr>`;

        for(var key in verifiedData) {
            var leerling = verifiedData[key];
            htmlStringVerified += `<tr>
                    <td>${leerling.familienaam}</td>
                    <td>${leerling.voornaam}</td>
                    <td>${leerling.leerjaar}</td>
                    <td class="c-table-icons">
                        <i class="material-icons">edit</i>
                    </td>
                </tr>`
        }

        htmlStringVerified += `</table>`;
    }

    unverifiedHTML.innerHTML = htmlStringUnverified;
    verifiedHTML.innerHTML = htmlStringVerified;
}

logout = () => {
    firebase.auth().signOut();
}

document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            if(localStorage.getItem('role') == "hanssens") {
                window.location.replace('/admin/scholen');
            }
            getLeerlingen(user);
        }
    });
});