const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// format the date in a JSON friendly way
function getDate() {
    // get date 
    var date = new Date();
    return {
        "date": date.getDate(),
        "month": `${monthNames[date.getMonth()]}`,
        "year": `${date.getFullYear()}`,
        "time": {
            "type": `${(date.getHours() >= 13) ? 'PM' : 'AM'}`,
            "hour": `${(date.getHours() >= 13) ? date.getHours() : `0${date.getHours()}`}`,
            "minutes": `${(date.getMinutes() >= 10) ? date.getMinutes() : `0${date.getMinutes()}`}`,
            "seconds": `${(date.getSeconds() >= 10) ? date.getSeconds() : `0${date.getSeconds()}`}`,
        }
    }

}

module.exports = {
    getDate
}