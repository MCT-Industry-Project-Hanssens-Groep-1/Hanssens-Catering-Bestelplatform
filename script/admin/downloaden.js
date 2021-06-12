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

    console.log(filteredBestellingData);
});

startDatePicker.addEventListener('change', (e) => {
    startDateString = new Date(e.target.value);
    var resultProductData = bestellingData.filter(bestelling => {
        if(!searchString == "") {
            date = new Date(bestelling.datum)
            return (date >= startDateString && date <= endDateString) && bestelling.school.toLowerCase().includes(searchString) || bestelling.school.toLowerCase().includes(searchString) && (date >= startDateString && date <= endDateString);
        } else {
            date = new Date(bestelling.datum);
            return (date >= startDateString && date <= endDateString);;
        }
      });
    console.log(resultProductData);
})

endDatePicker.addEventListener('change', (e) => {
    endDateString = new Date(e.target.value);
    var resultProductData = bestellingData.filter(bestelling => {
        if(!searchString == "") {
            date = new Date(bestelling.datum)
            return (date >= startDateString && date <= endDateString) && bestelling.school.toLowerCase().includes(searchString) || bestelling.school.toLowerCase().includes(searchString) && (date >= startDateString && date <= endDateString);
        } else {
            date = new Date(bestelling.datum);
            return (date >= startDateString && date <= endDateString);;
        }
    });
    console.log(resultProductData);
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

splitBestellingenPerMonth = (startdate, enddate) => {
    var startDate = new Date(startdate);
    var endDate = new Date(enddate);
    
    var resultProductData = bestellingData.filter(a => {
      var date = new Date(a.datum);
      return (date >= startDate && date <= endDate);
    });

    console.log(resultProductData)

    // for(var key in orderedBestellingen) {
    //     var bestellingen = orderedBestellingen[key]
    //     for(var key in bestellingen) {
    //         if(bestellingen[key].leerjaar == "1ste leerjaar") {
    //             console.log(bestellingen[key]);
    //         }
    //     }
    //     for(var key in bestellingen) {
    //         if(bestellingen[key].leerjaar == "Kleuter") {
    //             console.log(bestellingen[key]);
    //         }
    //     }
    // }
}

showBestellingen = (data) => {
    var downloadsHTML = document.querySelector('.js-downloads');
    var htmlString = `<tr>
    <th class="c-cell-margin">Maand</th>
    <th class="c-th"></th>
</tr>`;
    for(var key in data) {
        var bestellingen = data[key]
        console.log(key);
        htmlString += `<tr>
        <td class="c-cell-margin">${key}</td>
        <td class="c-table-icons c-icon-margin">
            <i class="material-icons" onclick="downloadExcel(${key})">download</i>
        </td>
        </tr>`
    }
    downloadsHTML.innerHTML = htmlString;
}

document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged((user) => {
    if (user) {
            userData = user;
            getBestellingen();
        }
    });
});