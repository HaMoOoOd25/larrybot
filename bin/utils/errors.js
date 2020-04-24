const Discord = require('discord.js');
const configFile = require("../botconfig");
const logHandler = require("./logHandler");

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

module.exports.wrongCommandUsage = (message, cmd) => {
    SendMessage(message, `**Incorrect Command Usage.**\n\n` + '``' + `${configFile.prefix}${cmd}` + '``');
};

module.exports.userAdmin = (message) => {
    SendMessage(message, "You can't perform this action to an admin.");
};

module.exports.noUserError = (message) => {
    SendMessage(message, "User not found.");
};

module.exports.notFoundItem = (message, item) => {
    SendMessage(message, `We don't have that item that is called **${item}**.`);
};

module.exports.noEnoughCoins = (message, userBalance, cost, item) => {
    SendMessage(message, `You need **${cost - userBalance}** more coins to buy **${item}**.`);
};

//Errors to show on console

module.exports.databaseError = (message, error, filename) => {
    filename = filename.replace(/^.*[\\\/]/, '');

    SendMessage(message, "Database Error.");
    logHandler.error(`Database Error: ${filename} : ${error}`);
};

module.exports.roleManageFail = (error, filename) => {
    filename = filename.replace(/^.*[\\\/]/, '');
    logHandler.error(`Failed To Add/Remove Role: ${filename} : ${error}`);
};

module.exports.botNoPermission = (message, filename) => {
    filename = filename.replace(/^.*[\\\/]/, '');
    SendMessage(message, "I don't have permission to do that!");
};

module.exports = (error, filename) => {
    filename = filename.replace(/^.*[\\\/]/, '');
    logHandler.error(`Error: ${filename} : ${error}`);
};

