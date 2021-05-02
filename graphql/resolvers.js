module.exports = {
    hello ({name}, req) {
        const i = 4;
        return {
            id: i,
            reg: name
        };
    }
};