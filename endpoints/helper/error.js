function errorMessage(error, res, errorcode) {
    console.error(`[Error] ${error}`);
    res.status(errorcode || 500).json({
        "success": "false",
        "error": error.message
    });
    return;
}

module.exports = {
    errorMessage
}