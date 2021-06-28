/**
 * Check weather the supplied password is the same as the one stored in the .env file
 * ! This could be re-worked to be more secure
 * 
 * @param {string} password 
 * @param {Object} next 
 * @returns bool
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