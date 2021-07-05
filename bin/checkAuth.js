require('dotenv').config();

/**
 * Check weather the supplied password is the same as the one stored in the .env file
 * ! This could be re-worked to be more secure
 * 
 * @param {String} password 
 * @param {Object} next 
 * @returns {boolean} True or False if auth failed
 */
function checkAuth(password, next) {
    if (password != process.env.WebhookToken) {
        const error = new Error("❌ Authentication Error ❌");
        error.status = 401;
        next(error);
        return false;
    } else {
        return true;
    }
}

module.exports = {
    checkAuth
}