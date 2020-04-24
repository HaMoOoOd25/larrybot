const Discord = require("discord.js");
const coinsSchema = require("../../utils/Schemas/coinSchema");
const errors = require("../../utils/errors");
const db = require("quick.db");
const ms = require("parse-ms");
const path = require("path");

module.exports.run = async (bot, message, args, messageArray) => {
    if (message.channel.id !== bot.settings.botCommandsChannel) return;

    //Cooldown
    const cooldown = 2.16e+7;
    let lastDaily = await db.fetch(`lastWork_${message.author.id}`);
    if(lastDaily !== null && cooldown - (Date.now() - lastDaily) > 0){
        let timeObj = ms(cooldown - (Date.now() - lastDaily));
        const coolDownEmbed = new Discord.RichEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setColor("FF0000")
            .setDescription(`You have to wait **${timeObj.hours}h ${timeObj.minutes}m ${timeObj.seconds}s** before working again.`);
        return message.channel.send(coolDownEmbed);
    }
    db.set(`lastWork_${message.author.id}`, Date.now());

    //Get some jobs
    const jobs = ["developer", "designer", "donut delivery guy", "streamer", "teacher", "cop", "programmer", "doctor",
    "scientist", "researcher", "sales man", "cashier", "bodyguard", "dish washer", "donut eater", "donut chef"];

    //Get a random job
    const randomJob = Math.floor(Math.random() * jobs.length);

    //The earning range 250-750
    const min = Math.ceil(15);
    const max = Math.floor(50 + 1);
    const toEarn = Math.floor(Math.random() * (max - min) + min);

    //Preparing the embed
    const attachment = new Discord.Attachment(path.resolve(__dirname, "../../images/coin.png").toString(), "coin.png");
    const jobEmbed = new Discord.RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setColor(bot.settings.embedColor)
        .attachFile(attachment)
        .setThumbnail("attachment://coin.png")
        .setDescription(`You worked as a **${jobs[randomJob]}** and earned **${toEarn}** coins.`);

    coinsSchema.findOne({
        guildID: message.guild.id,
        userID: message.author.id
    }, (err, res) => {
        if (err) return errors.databaseError(message, err, __filename);

        if (!res) {
            const newData = new coinsSchema({
                guildID: message.guild.id,
                userID: message.author.id,
                coins: toEarn,
                bank: 0
            });
            newData.save().catch(err => errors.databaseError(message, err, __filename));
        }else{
            res.coins += toEarn;
            res.save().catch(err => errors.databaseError(message, err, __filename));
        }
        message.channel.send(jobEmbed);
    });
};

module.exports.config = {
    name: "work",
    usage: "rob",
    description: "Work on a random job to earn coins in the server.",
    aliases: [],
    noalias: "No alias",
    permission: [],
    enabled: true
};