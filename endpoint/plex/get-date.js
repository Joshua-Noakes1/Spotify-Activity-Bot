const moment = require('moment-timezone');
const date = new Date();

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function getTime() {
    return {
        "Date": `${date.getDate()}`,
        "Month": monthNames[date.getMonth()],
        "Year": `${date.getFullYear()}`,
        "Time": moment().tz("Europe/London").format('hh:mmA')
    }
}

module.exports = {
    getTime
}