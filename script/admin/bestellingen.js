var db = firebase.firestore()

var searchBar = document.getElementById('js-search');
var searchBarKlas = document.getElementById('js-search-klas');
var datePicker = document.getElementById('js-datepicker');
var editModal = document.getElementById("edit-modal");

var userData = "", bestellingData = [];

var searchString, searchStringKlas, dateString;

var updateBestelling = function(){};

openEditModal = (rijksregister, datum, soep, maaltijd, toezicht, naarhuis) => {
    var saveButton = document.querySelector('.js-edit-save');
    var soepCheckbox = document.getElementById('soepCheckbox');
    var maaltijdCheckbox = document.getElementById('maaltijdCheckbox');
    var toezichtCheckbox = document.getElementById('toezichtCheckbox');
    var naarhuisCheckbox = document.getElementById('naarhuisCheckbox');

    if(soep == "true") {
        soepCheckbox.checked = true;
    }
    if(maaltijd == "true") {
        maaltijdCheckbox.checked = true;
    }
    if(toezicht == "true") {
        toezichtCheckbox.checked = true;
    }
    if(naarhuis == "true") {
        naarhuisCheckbox.checked = true;
    }

    editModal.style.transform = "translate(0)";
    editModal.style.opacity = "1";
  
    updateBestelling = () => {
        db.collection("bestellingen").doc(rijksregister).get().then((doc) => {
                doc.ref.update({
                    ['bestellingen.' + datum + '.soep']: soepCheckbox.checked,
                    ['bestellingen.' + datum + '.maaltijd']: maaltijdCheckbox.checked,
                    ['bestellingen.' + datum + '.toezicht']: toezichtCheckbox.checked,
                    ['bestellingen.' + datum + '.naarhuis']: naarhuisCheckbox.checked,
            })
        });
    }
  
    saveButton.addEventListener('click', updateBestelling);
  }
  
closeEditModal = () => {
    var saveButton = document.querySelector('.js-edit-save');

    editModal.style.transform = "translate(9999px)";
    editModal.style.opacity = "0";

    document.getElementById('soepCheckbox').checked = false;
    document.getElementById('maaltijdCheckbox').checked = false;
    document.getElementById('toezichtCheckbox').checked = false;
    document.getElementById('naarhuisCheckbox').checked = false;
    saveButton.removeEventListener('click', updateBestelling);
}


window.onclick = function(event) {
    if (event.target == editModal) {
        closeEditModal();
    }
}

searchBar.addEventListener('keyup', (e) => {
    searchString = e.target.value.toLowerCase();
    var filteredBestellingData = bestellingData.filter(bestelling => {
        if(!dateString == "" && !searchStringKlas == "") {
            return bestelling.naam.toLowerCase().includes(searchString) && bestelling.datum.toLowerCase().includes(dateString) && bestelling.klas.toLowerCase().includes(searchStringKlas) || bestelling.datum.toLowerCase().includes(dateString) && bestelling.klas.toLowerCase().includes(searchStringKlas) && bestelling.naam.toLowerCase().includes(searchString) || bestelling.klas.toLowerCase().includes(searchStringKlas) && bestelling.naam.toLowerCase().includes(searchString) && bestelling.datum.toLowerCase().includes(dateString);
        } else if (!dateString == "" && !searchString == "") {
            return bestelling.naam.toLowerCase().includes(searchString) && bestelling.datum.toLowerCase().includes(dateString) || bestelling.datum.toLowerCase().includes(dateString) && bestelling.naam.toLowerCase().includes(searchString);
        } else if (!searchStringKlas == "" && !searchString == "") {
            return bestelling.naam.toLowerCase().includes(searchString) && bestelling.klas.toLowerCase().includes(searchStringKlas) || bestelling.klas.toLowerCase().includes(searchStringKlas) && bestelling.naam.toLowerCase().includes(searchString);
        } else if (!searchStringKlas == "" && !dateString == "") {
            return bestelling.klas.toLowerCase().includes(searchStringKlas) && bestelling.datum.toLowerCase().includes(dateString) || bestelling.datum.toLowerCase().includes(dateString) && bestelling.klas.toLowerCase().includes(searchStringKlas);
        } else if (!searchStringKlas == "") {
            return bestelling.klas.toLowerCase().includes(searchStringKlas);
        } else if (!dateString == "") {
            return bestelling.datum.toLowerCase().includes(dateString);
        } else {
            return bestelling.naam.toLowerCase().includes(searchString);
        }
    })
    filteredBestellingData.sort(function(a,b){
        return new Date(b.datum) - new Date(a.datum);
    });
    showBestellingen(filteredBestellingData);
});

datePicker.addEventListener('change', (e) => {
    dateString = e.target.value.toLowerCase();
    var filteredBestellingData = bestellingData.filter(bestelling => {
        if(!searchString == "" && !searchStringKlas == "") {
            return bestelling.naam.toLowerCase().includes(searchString) && bestelling.datum.toLowerCase().includes(dateString) && bestelling.klas.toLowerCase().includes(searchStringKlas) || bestelling.datum.toLowerCase().includes(dateString) && bestelling.klas.toLowerCase().includes(searchStringKlas) && bestelling.naam.toLowerCase().includes(searchString) || bestelling.klas.toLowerCase().includes(searchStringKlas) && bestelling.naam.toLowerCase().includes(searchString) && bestelling.datum.toLowerCase().includes(dateString);
        } else if (!searchString == "" && !dateString == "") {
            return bestelling.naam.toLowerCase().includes(searchString) && bestelling.datum.toLowerCase().includes(dateString) || bestelling.datum.toLowerCase().includes(dateString) && bestelling.naam.toLowerCase().includes(searchString);
        } else if (!searchStringKlas == "" && !dateString == "") {
            return bestelling.datum.toLowerCase().includes(dateString) && bestelling.klas.toLowerCase().includes(searchStringKlas) || bestelling.klas.toLowerCase().includes(searchStringKlas) && bestelling.datum.toLowerCase().includes(dateString);
        } else if (!searchStringKlas == "" && !searchString == "") {
            return bestelling.naam.toLowerCase().includes(searchString) && bestelling.klas.toLowerCase().includes(searchStringKlas) || bestelling.klas.toLowerCase().includes(searchStringKlas) && bestelling.naam.toLowerCase().includes(searchString);
        } else if (!searchStringKlas == "") {
            return bestelling.klas.toLowerCase().includes(searchStringKlas);
        } else if (!searchString == "") {
            return bestelling.naam.toLowerCase().includes(searchString);
        } else {
            return bestelling.datum.toLowerCase().includes(dateString);
        }
    })
    filteredBestellingData.sort(function(a,b){
        return new Date(b.datum) - new Date(a.datum);
    });
    showBestellingen(filteredBestellingData);
})

searchBarKlas.addEventListener('keyup', (e) => {
    searchStringKlas = e.target.value.toLowerCase();
    var filteredBestellingData = bestellingData.filter(bestelling => {
        if(!dateString == "" && !searchString == "") {
            return bestelling.naam.toLowerCase().includes(searchString) && bestelling.datum.toLowerCase().includes(dateString) && bestelling.klas.toLowerCase().includes(searchStringKlas) || bestelling.datum.toLowerCase().includes(dateString) && bestelling.klas.toLowerCase().includes(searchStringKlas) && bestelling.naam.toLowerCase().includes(searchString) || bestelling.klas.toLowerCase().includes(searchStringKlas) && bestelling.naam.toLowerCase().includes(searchString) && bestelling.datum.toLowerCase().includes(dateString);
        } else if (!searchString == "" && !searchStringKlas == "") {
            return bestelling.naam.toLowerCase().includes(searchString) && bestelling.klas.toLowerCase().includes(searchStringKlas) || bestelling.klas.toLowerCase().includes(searchStringKlas) && bestelling.naam.toLowerCase().includes(searchString);
        } else if (!dateString == "" && !searchStringKlas == "") {
            return bestelling.datum.toLowerCase().includes(dateString) && bestelling.klas.toLowerCase().includes(searchStringKlas) || bestelling.klas.toLowerCase().includes(searchStringKlas) && bestelling.datum.toLowerCase().includes(dateString);
        } else if (!searchString == "" && !dateString == "") {
            return bestelling.datum.toLowerCase().includes(dateString) && bestelling.naam.toLowerCase().includes(searchString) || bestelling.naam.toLowerCase().includes(searchString) && bestelling.datum.toLowerCase().includes(dateString);
        } else if (!searchString == "") {
            return bestelling.naam.toLowerCase().includes(searchString);
        } else if (!dateString == "") {
            return bestelling.datum.toLowerCase().includes(dateString);
        } else {
            return bestelling.klas.toLowerCase().includes(searchStringKlas);
        }
    })
    filteredBestellingData.sort(function(a,b){
        return new Date(b.datum) - new Date(a.datum);
    });
    showBestellingen(filteredBestellingData);
});


getBestellingen = () => {
    db.collection('bestellingen')
    .onSnapshot((querySnapshot) => {
        bestellingData = [];
        querySnapshot.forEach((doc) => {
            bestellingen = doc.data().bestellingen;
            for(var obj in bestellingen) {
                var bestelling = bestellingen[obj];
                if(bestelling.school == userData.displayName) {
                    bestellingData.push(bestelling)
                    bestellingData.sort(function(a,b){
                        return new Date(b.datum) - new Date(a.datum);
                    });
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
    <th>Klas</th>
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
            <td>${obj.klas}</td>
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
        <i class="material-icons" onclick="openEditModal('${obj.rijksregister}', '${obj.datum}', '${obj.soep}', '${obj.maaltijd}', '${obj.toezicht}', '${obj.naarhuis}')">edit</i>
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