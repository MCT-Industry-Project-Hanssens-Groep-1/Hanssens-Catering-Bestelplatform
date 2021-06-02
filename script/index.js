var DateTime = luxon.DateTime;

var dt = DateTime.now();
var firstDayOfWeek= dt.startOf('week').toISODate();
var lastDayOfWeek = dt.endOf('week');
var lastDayOfWorkWeek = lastDayOfWeek.minus({days: 2}).toISODate();
var currentWeek = Math.ceil(dt.day / 7);
var currentMonth = dt.monthLong;

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

    console.log(firstDayOfWeek);
    console.log(lastDayOfWorkWeek);

    setDate();
}

lastWeek = () => {
    dt = dt.minus({weeks: 1});
    firstDayOfWeek= dt.startOf('week').toISODate();
    lastDayOfWeek = dt.endOf('week');
    lastDayOfWorkWeek = lastDayOfWeek.minus({days: 2}).toISODate();
    currentWeek = Math.ceil(dt.day / 7);
    currentMonth = dt.monthLong;

    console.log(firstDayOfWeek);
    console.log(lastDayOfWorkWeek);

    setDate();
}

logout = () => {
    firebase.auth().signOut();
}

document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            window.location.replace("/login")
        } else if (user) {
            console.log(user);
        }
      });
    setDate();
});