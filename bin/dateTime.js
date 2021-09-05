const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// format the date in a JSON friendly way
function dateTime() {
    // get date 
    var date = new Date();

    // add ordinals
    switch (date.getDate()) {
        case 1:
        case 21:
        case 31:
            var ordinals = 'st';
            break;
        case 2:
        case 22:
            var ordinals = 'nd';
            break;
        case 3:
        case 23:
            var ordinals = 'rd';
            break;
        default:
            var ordinals = 'th';
    }

    // return date data
    return {
        "date": date.getDate(),
        "month": `${monthNames[date.getMonth()]}`,
        "year": `${date.getFullYear()}`,
        "ordinals": ordinals,
        "time": {
            "type": `${(date.getHours() >= 13) ? 'PM' : 'AM'}`,
            "hour": `${(date.getHours() >= 10) ? date.getHours() : `0${date.getHours()}`}`,
            "minutes": `${(date.getMinutes() >= 10) ? date.getMinutes() : `0${date.getMinutes()}`}`,
            "seconds": `${(date.getSeconds() >= 10) ? date.getSeconds() : `0${date.getSeconds()}`}`,
        }
    }
}

module.exports = {
    dateTime
}