const mongoDb = require("mongoose");

const coinSchema = mongoDb.Schema({
    guildID: String,
    userID: String,
    coins: Number,
    bank: Number
});

module.exports = mongoDb.model("coins", coinSchema);