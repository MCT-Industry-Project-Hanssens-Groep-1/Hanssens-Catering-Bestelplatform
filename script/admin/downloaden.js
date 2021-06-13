var DateTime = luxon.DateTime;
var db = firebase.firestore()

var searchBar = document.getElementById('js-search');
var startDatePicker = document.getElementById('js-startdate');
var endDatePicker = document.getElementById('js-enddate');

var userData = "", bestellingData = [], orderedBestellingen = {};

var searchString, startDateString, endDateString, date;

searchBar.addEventListener('keyup', (e) => {
    searchString = e.target.value.toLowerCase();
    var filteredBestellingData = bestellingData.filter(bestelling => {
        if(!startDateString == "" && !endDateString == "") {
            date = new Date(bestelling.datum)
            return bestelling.school.toLowerCase().includes(searchString) && (date >= startDateString && date <= endDateString) || (date >= startDateString && date <= endDateString) && bestelling.school.toLowerCase().includes(searchString);
        } else {
            return bestelling.school.toLowerCase().includes(searchString);
        }
    })
    filteredBestellingData.sort(function(a,b){
        return new Date(a.datum) - new Date(b.datum);
    });

    showBestellingen(filteredBestellingData, DateTime.fromJSDate(startDateString).toISODate(), DateTime.fromJSDate(endDateString).toISODate());

});

startDatePicker.addEventListener('change', (e) => {
    startDateString = new Date(e.target.value);
    var filteredBestellingData = bestellingData.filter(bestelling => {
        if(!searchString == "") {
            date = new Date(bestelling.datum)
            return (date >= startDateString && date <= endDateString) && bestelling.school.toLowerCase().includes(searchString) || bestelling.school.toLowerCase().includes(searchString) && (date >= startDateString && date <= endDateString);
        } else {
            date = new Date(bestelling.datum);
            return (date >= startDateString && date <= endDateString);;
        }
      });

    filteredBestellingData.sort(function(a,b){
        return new Date(a.datum) - new Date(b.datum);
    });

    showBestellingen(filteredBestellingData, DateTime.fromJSDate(startDateString).toISODate(), DateTime.fromJSDate(endDateString).toISODate());
})

endDatePicker.addEventListener('change', (e) => {
    endDateString = new Date(e.target.value);
    var filteredBestellingData = bestellingData.filter(bestelling => {
        if(!searchString == "") {
            date = new Date(bestelling.datum)
            return (date >= startDateString && date <= endDateString) && bestelling.school.toLowerCase().includes(searchString) || bestelling.school.toLowerCase().includes(searchString) && (date >= startDateString && date <= endDateString);
        } else {
            date = new Date(bestelling.datum);
            return (date >= startDateString && date <= endDateString);;
        }
    });

    filteredBestellingData.sort(function(a,b){
        return new Date(a.datum) - new Date(b.datum);
    });

    showBestellingen(filteredBestellingData, DateTime.fromJSDate(startDateString).toISODate(), DateTime.fromJSDate(endDateString).toISODate());
})

logout = () => {
    firebase.auth().signOut();
}

getBestellingen = () => {
    db.collection('bestellingen')
    .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            bestellingen = doc.data().bestellingen;
            for(var obj in bestellingen) {
                var bestelling = bestellingen[obj];
                bestellingData.push(bestelling)
            }
        })
    })
}

showBestellingen = (data, startdatum, einddatum) => {
    var bestellingenHTML = document.querySelector('.js-bestellingen');
    var downloadHTML = document.querySelector('.js-download');
    var htmlStringDownload = "";
    var htmlStringBestellingen = "";
    htmlStringBestellingen += `<thead>
    <tr>
        <th>School</th>
        <th>Naam</th>
        <th>Klas</th>
        <th>Datum</th>
        <th>Soep</th>
        <th>Maaltijd</th>
        <th>Toezicht</th>
        <th>Naar huis</th>
        <th>Code</th>
    </tr>
    </thead>
    <tbody>`

    if(data == "") {
        htmlStringDownload = "";
        htmlStringBestellingen = "";
    } else {
        if(!startdatum == "" && !einddatum == "") {
            htmlStringDownload = `<tr>
            <th class="c-cell-margin">Start datum</th>
            <th class="c-cell-margin">Eind datum</th>
            <th class="c-th"></th>
            </tr>
            <tr>
            <td class="c-cell-margin">${startdatum}</td>
            <td class="c-cell-margin">${einddatum}</td>
            <td class="c-table-icons c-icon-margin">
                <i class="material-icons" onclick="download()">download</i>
            </td>
            </tr>`
        } else {
            htmlStringDownload = `<tr>
            <th class="c-cell-margin">Start datum</th>
            <th class="c-cell-margin">Eind datum</th>
            <th class="c-th"></th>
            </tr>
            <tr>
            <td class="c-cell-margin">Geen einddatum</td>
            <td class="c-cell-margin">Geen startdatum</td>
            <td class="c-table-icons c-icon-margin">
                <i class="material-icons" onclick="download()">download</i>
            </td>
            </tr>`
        }
    
        for(var key in data) {
            var obj = data[key];
            htmlStringBestellingen += `<tr>
            <td>${obj.school}</td>
            <td>${obj.naam}</td>
            <td>${obj.klas}</td>
            <td>${obj.datum}</td>`
    
            if(obj.soep == true) {
                htmlStringBestellingen += `<td>JA</td>`
            } else {
                htmlStringBestellingen += `<td>NEE</td>`
            }
    
            if(obj.maaltijd == true) {
                htmlStringBestellingen += `<td>JA</td>`
            } else {
                htmlStringBestellingen += `<td>NEE</td>`
            }
    
            if(obj.toezicht == true) {
                htmlStringBestellingen += `<td>JA</td>`
            } else {
                htmlStringBestellingen += `<td>NEE</td>`
            }
    
            if(obj.naarhuis == true) {
                htmlStringBestellingen += `<td>JA</td>`
            } else {
                htmlStringBestellingen += `<td>NEE</td>`
            }
    
            htmlStringBestellingen += `<td>${obj.code}</td>
            </tr>`
        }
    
        htmlStringBestellingen += `</tbody>`
    }

    downloadHTML.innerHTML = htmlStringDownload;
    bestellingenHTML.innerHTML = htmlStringBestellingen;

}

download = () => {
    var table2excel = new Table2Excel();
    table2excel.export(document.querySelectorAll("#excel-table"));
}

document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged((user) => {
    if (user) {
            if(localStorage.getItem('role') == "school") {
                window.location.replace('/admin/leerlingen');
            }

            userData = user;
            getBestellingen();
        }
    });
});