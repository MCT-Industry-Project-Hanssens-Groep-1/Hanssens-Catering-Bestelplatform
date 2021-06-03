var DateTime = luxon.DateTime;
var db = firebase.firestore()

var dt = DateTime.now();
var firstDayOfWeek = dt.startOf('week').toISODate();
var lastDayOfWeek = dt.endOf('week');
var lastDayOfWorkWeek = lastDayOfWeek.minus({days: 2}).toISODate();
var currentWeek = Math.ceil(dt.day / 7);
var currentMonth = dt.monthLong;
let menuHTML = document.querySelector(".js-menus");

let userData, menuData = "", kindVoorkeurCode, kindNaam = "Selecteer jouw kind";

var e = document.getElementById("select-kinderen");

e.addEventListener('change', function() {
    kindVoorkeurCode = e.options[e.selectedIndex].getAttribute("code");
    kindNaam = e.options[e.selectedIndex].value;

    if(kindNaam == "Selecteer jouw kind") {
        menuData = "";
        menuHTML.innerHTML = `<div class="c-dashboard-welkom">
        <h1 class="js-welkom">Welkom, </h1>
        <h2>Selecteer jouw kind of voeg jouw kind toe in de instellingen.</h2>
    </div>`
        setWelkom(userData);
    }
    getMenus(kindVoorkeurCode, firstDayOfWeek, lastDayOfWorkWeek)
})

setDate = () => {
    let datumHTML = document.querySelector('.js-datum');
    datumHTML.innerHTML = `${currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)} - Week ${currentWeek}`;
} 

nextWeek = () => {
    dt = dt.plus({weeks: 1});
    firstDayOfWeek= dt.startOf('week').toISODate();
    lastDayOfWeek = dt.endOf('week');
    lastDayOfWorkWeek = lastDayOfWeek.minus({days: 2}).toISODate();
    currentWeek = Math.ceil(dt.day / 7);
    currentMonth = dt.monthLong;

    setDate();
    getMenus(kindVoorkeurCode, firstDayOfWeek, lastDayOfWorkWeek);
}

lastWeek = () => {
    dt = dt.minus({weeks: 1});
    firstDayOfWeek= dt.startOf('week').toISODate();
    lastDayOfWeek = dt.endOf('week');
    lastDayOfWorkWeek = lastDayOfWeek.minus({days: 2}).toISODate();
    currentWeek = Math.ceil(dt.day / 7);
    currentMonth = dt.monthLong;

    setDate();
    getMenus(kindVoorkeurCode, firstDayOfWeek, lastDayOfWorkWeek);
}

setWelkom = (user) => {
    let welkomHTML = document.querySelector(".js-welkom");
    welkomHTML.innerText = `Welkom, ${user.displayName}`
}

logout = () => {
    firebase.auth().signOut();
}

getKinderen = (user) => {
    let kinderenHTML = document.querySelector('.js-kinderen');
    db.collection("kinderen")
    .where("ouders", "array-contains", `${user.uid}`)
    .onSnapshot((querySnapshot) => {
        let htmlString = "<option>Selecteer jouw kind</option>"
        querySnapshot.forEach((doc) => {
        htmlString += `<option code="${doc.data().code}" value="${doc.data().naam}">${doc.data().naam}</option>`
        })
        kinderenHTML.innerHTML = htmlString;
    })
}

getMenus = async (codeId, startDate, endDate) => {
    if(kindNaam != "Selecteer jouw kind") {
        let token = await userData.getIdToken();
        const data = await fetch(`https://hanssens-catering-soapapi.azurewebsites.net/api/menu/${codeId}/${startDate}/${endDate}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
            .then((r) => r.json())
            .catch((err) => console.error('An error occured:', err));

        showMenus(data);
    } else {
        console.log("Geen kind geselecteerd!")
    }
}

showMenus = (data) => {
    let htmlString = ""
    let dagLong = dt.startOf('week');
    let count = 1;
    for(let obj of data) {
        let menu = obj.menu.toString();
        if(!menu == "" && obj.status == "incomplete") {
            let dagMenu = menu.split(',');
            let maaltijd = `${dagMenu[1]}`
            if(dagMenu[2] != undefined) {
                maaltijd += ", " + `${dagMenu[2]}`
            }
            if(dagMenu[3] != undefined) {
                maaltijd += ", " + `${dagMenu[3]}`
            }
            htmlString += `<div class="c-dashboard-item">
            <div class="c-dashboard-item__day">
                <p class="c-dashboard-item__day-text">${dagLong.weekdayLong.charAt(0).toUpperCase() + dagLong.weekdayLong.slice(1)}</p>
                <p class="c-dashboard-item__day-number ">${dagLong.day}</p>
            </div>
            <div class="c-dashboard-item__content">
                <div class="c-dashboard-item__content-option">
                    <li class="c-form-field c-form-field--option c-option-list__item">
                        <input class="o-hide-accessible c-option c-option--hidden" type="checkbox" id="${dagMenu[0]}">
                        <label class="c-label c-label--option c-custom-option" for="${dagMenu[0]}">
                            <span class="c-custom-option__fake-input c-custom-option__fake-input--checkbox">
                                <svg class="c-custom-option__symbol" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6.75">
                                    <path d="M4.75,9.5a1,1,0,0,1-.707-.293l-2.25-2.25A1,1,0,1,1,3.207,5.543L4.75,7.086,8.793,3.043a1,1,0,0,1,1.414,1.414l-4.75,4.75A1,1,0,0,1,4.75,9.5" transform="translate(-1.5 -2.75)"/>
                                </svg>
                            </span>
                            Soep
                        </label>
                    </li>
                    <p class="c-dashboard-text">${dagMenu[0]}</p>
                </div>
                <div class="c-dashboard-item__content-option">
                    <li class="c-form-field c-form-field--option c-option-list__item">
                        <input class="o-hide-accessible c-option c-option--hidden" type="checkbox" id="${dagMenu[1]}">
                        <label class="c-label c-label--option c-custom-option" for="${dagMenu[1]}">
                            <span class="c-custom-option__fake-input c-custom-option__fake-input--checkbox">
                                <svg class="c-custom-option__symbol" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6.75">
                                    <path d="M4.75,9.5a1,1,0,0,1-.707-.293l-2.25-2.25A1,1,0,1,1,3.207,5.543L4.75,7.086,8.793,3.043a1,1,0,0,1,1.414,1.414l-4.75,4.75A1,1,0,0,1,4.75,9.5" transform="translate(-1.5 -2.75)"/>
                                </svg>
                            </span>
                            Maaltijd
                        </label>
                    </li>
                    <p class="c-dashboard-text">${maaltijd}
                </div>
                <div class="c-dashboard-item__content-option">
                    <li class="c-form-field c-form-field--option c-option-list__item">
                        <input class="o-hide-accessible c-option c-option--hidden" type="checkbox" id="naarhuis${count}">
                        <label class="c-label c-label--option c-custom-option" for="naarhuis${count}">
                            <span class="c-custom-option__fake-input c-custom-option__fake-input--checkbox">
                                <svg class="c-custom-option__symbol" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6.75">
                                    <path d="M4.75,9.5a1,1,0,0,1-.707-.293l-2.25-2.25A1,1,0,1,1,3.207,5.543L4.75,7.086,8.793,3.043a1,1,0,0,1,1.414,1.414l-4.75,4.75A1,1,0,0,1,4.75,9.5" transform="translate(-1.5 -2.75)"/>
                                </svg>
                            </span>
                            Naar huis
                        </label>
                    </li>
                </div>
                <div class="c-dashboard-item__button">
                    <button class="o-button-reset c-button c-button-dashboard" onclick="">OPSLAAN</button>
                </div>
            </div>
        </div>`
        } else if(obj.status == "past-deadline") {
            htmlString += `<div class="c-dashboard-item">
            <div class="c-dashboard-item__day">
                <p class="c-dashboard-item__day-text">${dagLong.weekdayLong.charAt(0).toUpperCase() + dagLong.weekdayLong.slice(1)}</p>
                <p class="c-dashboard-item__day-number ">${dagLong.day}</p>
            </div>
            <div class="c-dashboard-item__content">
            <p>U bent te laat om te bestellen op deze dag.</p>
            </div>
        </div>`;
        } else if(obj.status == "complete") {
            htmlString += `<div class="c-dashboard-item">
            <div class="c-dashboard-item__day">
                <p class="c-dashboard-item__day-text">${dagLong.weekdayLong.charAt(0).toUpperCase() + dagLong.weekdayLong.slice(1)}</p>
                <p class="c-dashboard-item__day-number ">${dagLong.day}</p>
            </div>
            <div class="c-dashboard-item__content">
            <p>Deze bestelling is al verwerkt, U kan niet meer bestellen.</p>
            </div>
        </div>`;
        } else {
            htmlString += `<div class="c-dashboard-item">
            <div class="c-dashboard-item__day">
                <p class="c-dashboard-item__day-text">${dagLong.weekdayLong.charAt(0).toUpperCase() + dagLong.weekdayLong.slice(1)}</p>
                <p class="c-dashboard-item__day-number ">${dagLong.day}</p>
            </div>
            <div class="c-dashboard-item__content">
            <p>Er is geen menu op deze dag.</p>
            </div>
        </div>`;
        }

        dagLong = dagLong.plus({days: 1});
        count += 1;
    }

    menuHTML.innerHTML = htmlString;
}

document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            window.location.replace("/login")
        } else if (user) {
            userData = user;
            getKinderen(user);
            setWelkom(user);
            setDate();
        }
      });
});