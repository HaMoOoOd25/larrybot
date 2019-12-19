const Discord = require('discord.js');
const configFile = require("../botconfig");

function SendMessage(msg,...message){
    const embed = new Discord.RichEmbed()
        .setAuthor(msg.author.tag, msg.author.avatarURL)
        .setColor("#FF0000")
        .setDescription(...message);
    msg.channel.send(embed).then(msg => {
        msg.delete(10000);
    });
}

module.exports.noPermissionError = (message) => {
    SendMessage(message, "You don't have permission to do that!");
};

module.exports.yourselfError = (message) => {
    SendMessage(message, "You can't do that to yourself silly.");
};

module.exports.noUserError = (message) => {
    SendMessage(message, "Please mention one member to do this action.");
};

module.exports.noAmountError = (message) => {
    SendMessage(message, "Please specify an amount.");
};

module.exports.botNoPermission = (message) => {
    SendMessage(message, "I don't have permission to do that!");
};

module.exports.wrongCommandUsage = (message, cmd) => {
    SendMessage(message, `**Incorrect Command Usage.**\n\n` + '``' + `${configFile.prefix}${cmd}` + '``');
};

module.exports.userAdmin = (message) => {
    SendMessage(message, "You can't perform this action to an admin.");
};

module.exports.noUserError = (message) => {
    SendMessage(message, "User not found.");
};

module.exports.databaseError = (message, error) => {
    SendMessage(message, "Database error.");
    console.log(error);
};

//Shop related errors
module.exports.notFoundItem = (message, item) => {
    SendMessage(message, `We don't have that item that is called **${item}**.`);
};

module.exports.noEnoughCoins = (message, userBalance, cost, item) => {
    SendMessage(message, `You need **${cost - userBalance}** more coins to buy **${item}**.`);
};