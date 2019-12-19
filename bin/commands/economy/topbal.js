const Discord = require("discord.js");
const errors = require("../../utils/errors");
const coinsSchema = require("../../utils/Schemas/coinSchema");

module.exports.run = (bot, message, args, messageArray) => {

    const emojis = ['🥇', '🥈', '🥉', '🔹', '🔹', '🔹', '🔸', '🔸', '🔸', '🔸'];
    coinsSchema.find({
    }).sort([
        ['bank', 'descending']
    ]).exec((err, res) => {
        if (err) return errors.databaseError(message, err);
        let leaderboardEmbed = new Discord.RichEmbed()
            .setTitle("Coins Leaderboard");

        if (res.length === 0){
            leaderboardEmbed.setColor('#FF0000');
            leaderboardEmbed.setDescription('No results were found!')
        } else if (res.length < 10){
            const leaderboard = [];
            for(i = 0; i < res.length; i++){
                let member = message.guild.members.get(res[i].userID) || 'User Left';
                if (member === "User Left"){
                    leaderboard.push(`${emojis[i]} **${member} | Balance:** ${res[i].bank} coins\n`);
                }else{
                    leaderboard.push(`${emojis[i]} **${member.user.username} | Balance:** ${res[i].bank} coins\n`);
                }
            }
            leaderboardEmbed.setColor(bot.settings.embedColor);
            leaderboardEmbed.setDescription(leaderboard);
        }else{
            leaderboardEmbed.setColor(bot.settings.embedColor);
            const leaderboard = [];
            for(i = 0; i < 10; i++){
                let member = message.guild.members.get(res[i].userID) || 'User Left';
                if (member === "User Left"){
                    leaderboard.push(`${emojis[i]} **${member} | Balance:** ${res[i].bank} coins\n`);
                }else{
                    leaderboard.push(`${emojis[i]} **${member.user.username} | Balance:** ${res[i].bank} coins\n`);
                }
            }
            leaderboardEmbed.setDescription(leaderboard);
        }
        message.channel.send(leaderboardEmbed);
    });
};

module.exports.config = {
    name: "topbal",
    usage: "topbal",
    description: "Get the leaderboard of the richest members.",
    aliases: ["topcoins"],
    permission: [],
    enabled: true
};