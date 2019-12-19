const Discord = require("discord.js");
const coinsSchema = require("../../utils/Schemas/coinSchema");
const errors = require("../../utils/errors");
const db = require("quick.db");
const ms = require("parse-ms");
const path = require("path");


module.exports.run = async (bot, message, args, messageArray) => {
    if (message.channel.id !== bot.settings.botCommandsChannel) return;

     //Cooldown
    const cooldown = 8.64e+7;
    let lastDaily = await db.fetch(`lastDaily_${message.author.id}`);
    if(lastDaily !== null && cooldown - (Date.now() - lastDaily) > 0){
        let timeObj = ms(cooldown - (Date.now() - lastDaily));
        const coolDownEmbed = new Discord.RichEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setColor("FF0000")
            .setDescription(`You have to wait **${timeObj.hours}h ${timeObj.minutes}m ${timeObj.seconds}s** before claiming your daily reward again.`);
        return message.channel.send(coolDownEmbed);
    }
    db.set(`lastDaily_${message.author.id}`, Date.now());

    //Identify the range and the earning
    const min = Math.ceil(15);
    const max = Math.floor(50 + 1);
    const toEarn = Math.floor(Math.random() * (max - min) + min);

    coinsSchema.findOne({
        guildID: message.guild.id,
        userID: message.author.id
    }, (err, res) => {
        if (err) return errors.databaseError(message, err);
        if (!res){
            const newData = coinsSchema({
                guildID: message.guild.id,
                userID: message.author.id,
                coins: toEarn,
                bank: 0
            });
            newData.save().catch(err => errors.databaseError(message, err));
        }else{
            res.coins += toEarn;
            res.save().catch(err => errors.databaseError(message, err));
        }
        const attachment = new Discord.Attachment(path.resolve(__dirname, "../../images/coin.png").toString(), "coin.png");
        const EarnedEmbed = new Discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .attachFile(attachment)
            .setThumbnail("attachment://coin.png")
            .setDescription(`${message.author}, you have claimed your daily reward.\nYou have earned **${toEarn}** coins!`)
            .setColor(bot.settings.embedColor);
        message.channel.send(EarnedEmbed);
    })
};

module.exports.config = {
    name: "daily",
    usage: "daily",
    description: "Get your daily reward.",
    aliases: [],
    noalais: "No alias",
    permission: [],
    enabled: true
};