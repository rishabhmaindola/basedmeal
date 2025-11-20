const daysLeftEl = document.getElementById('daysLeft');
const joinedEl = document.getElementById('alreadyJoined');

const today = new Date();
const newYear = new Date(today.getFullYear() + 1, 0, 1);
const oneDay = 1000 * 60 * 60 * 24;

const daysLeft = Math.ceil((newYear - today) / oneDay);
daysLeftEl.textContent = daysLeft;

let currentJoined = parseInt(localStorage.getItem('joinedCount')) || 128;
let lastUpdate = localStorage.getItem('lastUpdate');

const now = new Date().toDateString();

if (lastUpdate !== now) {
    const randomIncrease = Math.floor(Math.random() * 6) + 10;
    currentJoined += randomIncrease;
    localStorage.setItem('joinedCount', currentJoined);
    localStorage.setItem('lastUpdate', now);
}

joinedEl.textContent = currentJoined;


document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        const icon = this.parentNode.querySelector('.check-icon');
        icon.style.opacity = this.checked ? '1' : '0';
    });
});