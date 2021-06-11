var db = firebase.firestore()

var searchBar = document.getElementById('js-search');
var datePicker = document.getElementById('js-datepicker');

var userData = "", bestellingData = [];

var searchString, dateString;

searchBar.addEventListener('keyup', (e) => {
    searchString = e.target.value.toLowerCase();
    var filteredBestellingData = bestellingData.filter(bestelling => {
        if(!dateString == "") {
            return bestelling.naam.toLowerCase().includes(searchString) && bestelling.datum.toLowerCase().includes(dateString) || bestelling.naam.toLowerCase().includes(dateString) && bestelling.datum.toLowerCase().includes(searchString);
        } else {
            return bestelling.naam.toLowerCase().includes(searchString);
        }
    })
    showBestellingen(filteredBestellingData);
});

datePicker.addEventListener('change', (e) => {
    dateString = e.target.value.toLowerCase();
    console.log(dateString);
    var filteredBestellingData = bestellingData.filter(bestelling => {
        if(!searchString == "") {
            return bestelling.datum.toLowerCase().includes(dateString) && bestelling.datum.toLowerCase().includes(searchString) || bestelling.naam.toLowerCase().includes(searchString) && bestelling.datum.toLowerCase().includes(dateString);
        } else {
            return bestelling.datum.toLowerCase().includes(dateString);
        }
    })
    showBestellingen(filteredBestellingData);
})

getBestellingen = () => {
    db.collection('bestellingen')
    .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            bestellingen = doc.data().bestellingen;
            for(var obj in bestellingen) {
                var bestelling = bestellingen[obj];
                if(bestelling.school == userData.displayName) {
                    bestellingData.push(bestelling)
                }
            }
    })
    showBestellingen(bestellingData);
})
}

showBestellingen = (data) => {
    var bestellingenHTML = document.querySelector('.js-bestellingen');
    var htmlString = "";
    htmlString = `                        <tr>
    <th>Naam</th>
    <th>Datum</th>
    <th class="c-th">Soep</th>
    <th class="c-th">Maaltijd</th>
    <th class="c-th">Toezicht</th>
    <th class="c-th">Naar huis</th>
    <th class="c-th"></th>
    </tr>`
    for(var obj of data) {
        htmlString += `<tr>
            <td>${obj.naam}</td>
            <td>${obj.datum}</td>`
        if(obj.soep == true) {
            htmlString += `<td class="c-td">
            <i class="material-icons check">check</i>
        </td>`
        } else {
            htmlString += `<td class="c-td">
            <i class="material-icons remove">remove</i>
        </td>`
        }

        if(obj.maaltijd == true) {
            htmlString += `<td class="c-td">
            <i class="material-icons check">check</i>
        </td>`
        } else {
            htmlString += `<td class="c-td">
            <i class="material-icons remove">remove</i>
        </td>`
        }

        if(obj.toezicht == true) {
            htmlString += `<td class="c-td">
            <i class="material-icons check">check</i>
        </td>`
        } else {
            htmlString += `<td class="c-td">
            <i class="material-icons remove">remove</i>
        </td>`
        }

        if(obj.naarhuis == true) {
            htmlString += `<td class="c-td">
            <i class="material-icons check">check</i>
        </td>`
        } else {
            htmlString += `<td class="c-td">
            <i class="material-icons remove">remove</i>
        </td>`
        }

        htmlString += `<td class="c-table-icons c-icon-margin">
        <i class="material-icons">edit</i>
        </td>
        </tr>`
    }
    bestellingenHTML.innerHTML = htmlString;
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

        userData = user;
        getBestellingen(user);
        }
    });
});