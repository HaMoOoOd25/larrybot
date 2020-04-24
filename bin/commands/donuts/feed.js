const Discord = require("discord.js");
const invSchema = require("../../utils/Schemas/invSchema");
const infoSchema = require("../../utils/Schemas/infoSchema");
const errors = require("../../utils/errors");
const path = require("path");

module.exports.run = async (bot, message, args, messageArray) => {
    if (message.channel.id !== bot.settings.botCommandsChannel) return;
    function addFeedDonut(){
        infoSchema.findOne({
            guildID: message.guild.id,
            userID: message.author.id
        }, (err, user) => {
            if (err) return errors.databaseError(message, err, __filename);

            if (user){
                user.feededDonuts++;
                user.save().catch(err => {
                    return errors.databaseError(message, err,  __filename);
                });

                if (user.feededDonuts === 500) {
                    const donutFeederRole = message.guild.roles.find(r => r.name === "Donut Feeder");
                    message.member.addRole(donutFeederRole).catch(err => console.log(err));
                    message.channel.send(`${message.author} you got the **${donutFeederRole.name}** role for feeding 500 donuts!`)
                }
            }else{
                const newUser = new infoSchema({
                    guildID: message.guild.id,
                    userID: message.author.id,
                    eatenDonuts: 0,
                    feededDonuts: 1,
                    cookedDonuts: 0,
                });
                newUser.save().catch(err => {
                    return errors.databaseError(message, err, __filename);
                });
            }
        });
    }

    function addEatenDonuts(member){
        infoSchema.findOne({
            guildID: message.guild.id,
            userID: member.user.id
        }, (err, user) => {
            if (err) return errors.databaseError(message, err, __filename);

            if (user){
                user.eatenDonuts++;
                user.save().catch(err => {
                    return errors.databaseError(message, err, __filename);
                });
                if (user.eatenDonuts === 500){
                    const donutAddictRole = message.guild.roles.find(r => r.name === "Donut Addict");
                    member.addRole(donutAddictRole).catch(err => console.log(err));
                    message.channel.send(`${member} you got the **${donutAddictRole.name}** role for eating 500 donuts!`)
                }else if (user.eatenDonuts === 5000){
                    const sugarRushRole = message.guild.roles.find(r => r.name === "Sugar Rush");
                    member.addRole(sugarRushRole).catch(err => err);
                    message.channel.send(`${member} you got the **${sugarRushRole.name}** role for eating 5000 donuts!`)
                }
            }else{
                const newUser = new infoSchema({
                    guildID: message.guild.id,
                    userID: member.user.id,
                    eatenDonuts: 1,
                    feededDonuts: 0,
                    cookedDonuts: 0,
                });
                newUser.save().catch(err => {
                    return errors.databaseError(message, err, __filename);
                });
            }
        });
    }

    if (args < 1 || message.mentions.users < 1) return errors.wrongCommandUsage(message, this.config.usage);

    const memberToFeed = message.mentions.members.first();

    if (memberToFeed.user.id === message.author.id){
        const noFeedYourself = new Discord.RichEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setColor(bot.settings.embedColor)
            .setDescription("You can't feed yourself silly!");
        return message.channel.send(noFeedYourself);
    }

    invSchema.findOne({
        guildID: message.guild.id,
        userID: message.author.id
    }, (err, inventory) => {
        if (err) return errors.databaseError(message, err, __filename);

        if (!inventory || inventory.items.donuts <= 0) {
            const noDonutEmbed = new Discord.RichEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setColor(bot.settings.embedColor)
                .setDescription("You don't have donuts to feed!");
            message.channel.send(noDonutEmbed);
        }else{
            inventory.items.donuts--;
            inventory.save().catch(err => {
                return errors.databaseError(message, err, __filename);
            });
            addFeedDonut();
            addEatenDonuts(memberToFeed);
            const attachment = new Discord.Attachment(path.resolve(__dirname, "../../images/donut.png").toString(), "donut.png");
            const ateDonut = new Discord.RichEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setColor(bot.settings.embedColor)
                .attachFile(attachment)
                .setThumbnail("attachment://donut.png")
                .setDescription(`You feed ${memberToFeed} a donut! You are so generous!!`);
            message.channel.send(ateDonut);
        }
    })
};

module.exports.config = {
    name: "feed",
    usage: "feed @user",
    description: "Feed someone one of your donuts!",
    aliases: [],
    noalias: "No Alias",
    permission: [],
    enabled: true
};