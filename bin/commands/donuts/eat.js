const Discord = require("discord.js");
const invSchema = require("../../utils/Schemas/invSchema");
const infoSchema = require("../../utils/Schemas/infoSchema");
const errors = require("../../utils/errors");
const path = require("path");

module.exports.run = async (bot, message, args, messageArray) => {
    if (message.channel.id !== bot.settings.botCommandsChannel) return;

    if (args[0] === "superdonut"){
        const embed = new Discord.RichEmbed()
            .setAuthor(message.author.tag,message.author.avatarURL)
            .setColor(bot.settings.embedColor)
            .setDescription("Use **.superdonut** instead.");
        return message.channel.send(embed);
    }
    function addDonut(){
        infoSchema.findOne({
            guildID: message.guild.id,
            userID: message.author.id
        }, (err, user) => {
           if (err) return errors.databaseError(message, err);

           if (user){
               user.eatenDonuts++;
               user.save().catch(err => errors.databaseError(message, err));
               if (user.eatenDonuts === 500){
                   const donutAddictRole = message.guild.roles.find(r => r.name === "Donut Addict");
                   message.member.addRole(donutAddictRole).catch(err => console.log(err));
                   message.channel.send(`${message.author} you got the **${donutAddictRole.name}** role for eating 500 donuts!`)
               }else if (user.eatenDonuts === 5000){
                   const sugarRushRole = message.guild.roles.find(r => r.name === "Sugar Rush");
                   message.member.addRole(sugarRushRole).catch(err => console.log(err));
                   message.channel.send(`${message.author} you got the **${sugarRushRole.name}** role for eating 5000 donuts!`)
               }
           }else{
               const newUser = new infoSchema({
                   guildID: message.guild.id,
                   userID: message.author.id,
                   eatenDonuts: 1,
                   feededDonuts: 0,
                   cookedDonuts: 0,
               });
               newUser.save().catch(err => errors.databaseError(message, err));
           }
        });
    }
    //eat
    invSchema.findOne({
        guildID: message.guild.id,
        userID: message.author.id
    }, (err, inventory) => {
        if (err) return errors.databaseError(message, err);

        if (!inventory || inventory.items.donuts <= 0) {
            const noDonutEmbed = new Discord.RichEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setColor(bot.settings.embedColor)
                .setDescription("You don't have donuts to eat!");
            message.channel.send(noDonutEmbed);
        }else{
            inventory.items.donuts--;
            inventory.save().catch(err => errors.databaseError(err, message));
            addDonut();
            const attachment = new Discord.Attachment(path.resolve(__dirname, "../../images/donut.png").toString(), "donut.png");
            const ateDonut = new Discord.RichEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setColor(bot.settings.embedColor)
                .attachFile(attachment)
                .setThumbnail("attachment://donut.png")
                .setDescription(`You have eaten a donut! YUM!!`);
            message.channel.send(ateDonut);
        }
    })
};

module.exports.config = {
    name: "eat",
    usage: "eat",
    description: "Eat one donut!",
    aliases: [],
    noalias: "No Alias",
    permission: [],
    enabled: true
};