var DateTime = luxon.DateTime;

var dt = DateTime.now();
var firstDayOfWeek= dt.startOf('week').toISODate();
var lastDayOfWeek = dt.endOf('week');
var lastDayOfWorkWeek = lastDayOfWeek.minus({days: 2}).toISODate();
var currentWeek = Math.ceil(dt.day / 7);

console.log(firstDayOfWeek);
console.log(lastDayOfWorkWeek);
console.log(currentWeek);

nextWeek = () => {
    dt = dt.plus({weeks: 1});
    firstDayOfWeek= dt.startOf('week').toISODate();
    lastDayOfWeek = dt.endOf('week');
    lastDayOfWorkWeek = lastDayOfWeek.minus({days: 2}).toISODate();
    currentWeek = Math.ceil(dt.day / 7);

    console.log(firstDayOfWeek);
    console.log(lastDayOfWorkWeek);
}

lastWeek = () => {
    dt = dt.minus({weeks: 1});
    firstDayOfWeek= dt.startOf('week').toISODate();
    lastDayOfWeek = dt.endOf('week');
    lastDayOfWorkWeek = lastDayOfWeek.minus({days: 2}).toISODate();
    currentWeek = Math.ceil(dt.day / 7);

    console.log(firstDayOfWeek);
    console.log(lastDayOfWorkWeek);
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
});