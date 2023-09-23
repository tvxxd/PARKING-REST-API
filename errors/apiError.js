class apiError extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = apiError