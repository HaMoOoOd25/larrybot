const Discord = require("discord.js");
const invSchema = require("../../utils/Schemas/invSchema");
const errors = require("../../utils/errors");

module.exports.run = (bot, message, args, messageArray) => {
    if (message.channel.id !== bot.settings.botCommandsChannel) return;
    let bag;

    invSchema.findOne({
        guildID: message.guild.id,
        userID: message.author.id
    }, (err, inventory) => {
        if (err) return errors.databaseError(message, err);

        if (inventory){
            bag = inventory.items;
            delete bag.$init;
            let invString = "";

            const invEmbed = new Discord.RichEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setTitle(`${message.author.username}'s inventory`)
                .setColor(bot.settings.embedColor);

            //Key : Value
            Object.keys(bag).forEach(function (item) {
                invString += `**${item}:** ${bag[item]}\n\n`
            });
            invEmbed.setDescription(invString);

            message.channel.send(invEmbed);
        }else{
            const noInvEmbed = new Discord.RichEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setColor("#FF0000")
                .setDescription(`You have no open inventory.`);
            return message.channel.send(noInvEmbed);
        }
    });
};

module.exports.config = {
    name : "inventory",
    usage: "inventory",
    description: "Check your inventory!",
    aliases: ["bag"],
    permission: [],
    enabled: true
};