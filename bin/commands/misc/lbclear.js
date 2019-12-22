const Discord = require("discord.js");
const messagesSchema = require("../../utils/Schemas/messagesSchema");
const errors = require("../../utils/errors");
const fs = require("fs");
const { resolve } = require("path");

//------

module.exports.run = async (bot, message, args, messageArray) => {
    clearMessageLeaderboard(message, bot);
};

function clearMessageLeaderboard(message, bot) {

    //First: We filter and get the first member.
    messagesSchema.find({
    }).sort([
        ['points', 'descending']
    ]).exec(async (err, res) => {
        if (err) {
            errors.databaseError(message);
            return console.log(err);
        }

        if (res){
            if (!res[0]) {
                try {
                    await message.guild.owner.user.send(`${message.guild.owner}, leaderboard reset but no winner was identified.`);
                }catch(e) {}
                return
            }

            const winner = message.guild.members.get(res[0].userID);

            //We clear the list
            messagesSchema.deleteMany({}, (err, res) => {
                if (err) return errors.databaseError(message, err);
            });

            if (winner) {
                const ResetedEmbed = new Discord.RichEmbed()
                    .setColor(bot.settings.embedColor)
                    .setDescription(`Leaderboard Reseted! Winner is ${winner} 🎉`)
                    .setAuthor(bot.user.username, bot.user.avatarURL);
                try {
                    await message.guild.owner.user.send(ResetedEmbed);
                    await message.guild.owner.user.send(`${message.guild.owner}`);
                }catch(e) {}
            }else{
                const noWinner = new Discord.RichEmbed()
                    .setColor(bot.settings.embedColor)
                    .setDescription(`Leaderboard Reseted! Couldn't identify a winner.`)
                    .setAuthor(bot.user.username, bot.user.avatarURL);
                try {
                    await message.guild.owner.user.send(noWinner);
                    await message.guild.owner.user.send(`${message.guild.owner}`);
                }catch(e) {}
            }

        }
    });
}

module.exports.config = {
    name: "lbclear",
    usage: "lbclear",
    description: "Clear the messages and houses leaderboard.",
    aliases: ["lbreset"],
    permission: ["ADMINISTRATOR"],
    enabled: true
};