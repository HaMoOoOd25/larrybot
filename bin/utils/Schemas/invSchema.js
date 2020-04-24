const mongoDb = require("mongoose");

const invSchema = mongoDb.Schema({
    guildID: String,
    userID: String,
    items: {
        donuts: Number,
        superdonut: Number,
        eggs: Number,
        flour: Number,
        milk: Number
    }
});

module.exports = mongoDb.model("inventory", invSchema);