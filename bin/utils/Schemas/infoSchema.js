const mongoDb = require("mongoose");

const infoSchema = mongoDb.Schema({
    guildID: String,
    userID: String,
    eatenDonuts: Number,
    feededDonuts: Number,
    cookedDonuts: Number
});

module.exports = mongoDb.model("userInfo", infoSchema);