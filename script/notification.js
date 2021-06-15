let notificationHolder = null;
const TIME_VISIBLE = 6000;

const getDom = () => {
    notificationHolder = document.querySelector('.js-notifications');
};

const fadeOutNotification = (notificationElement) => {
    const timerId = setTimeout(() => {
        notificationElement.classList.add('u-fading-out');

        // Als de fadeout gelukt is, dan verwijder ik het DOM element
        notificationElement.addEventListener('transitionend', function() {
            // this is hier notificationElement zelf
            this.parentNode.removeChild(this);
        })
        // notificationElement.parentNode.removeChild(notificationElement);
    }, TIME_VISIBLE)
}

const showNotification = (message, undoCallback) => {
    const notificationElement = document.createElement('div');
    notificationElement.classList.add('c-notification', 'u-will-fade');

    const messageElement = document.createElement('p');
    messageElement.innerText = message;
    messageElement.classList.add('c-notification__message');

    const buttonElement = document.createElement('button');
    buttonElement.innerHTML = `<i class="material-icons c-notification__icon">close</i>`;
    buttonElement.addEventListener('click', function(){
        notificationHolder.removeChild(notificationElement);
    });
    buttonElement.classList.add('c-notification__button')

    notificationElement.appendChild(messageElement);
    notificationElement.appendChild(buttonElement)

    notificationHolder.appendChild(notificationElement);

    fadeOutNotification(notificationElement)
}

document.addEventListener('DOMContentLoaded', function(){
    getDom();
});