const Discord = require("discord.js");
const invSchema = require("../../utils/Schemas/invSchema");
const infoSchema = require("../../utils/Schemas/infoSchema");
const errors = require("../../utils/errors");
const path = require("path");

module.exports.run = async (bot, message, args, messageArray) => {
    if (message.channel.id !== bot.settings.botCommandsChannel) return;
    function addCookedDonut(){
        infoSchema.findOne({
            guildID: message.guild.id,
            userID: message.author.id
        }, (err, user) => {
            if (err) return errors.databaseError(message, err);
            if (user){
                user.cookedDonuts++;
                user.save().catch(err => errors.databaseError(message, err));
                if (user.cookedDonuts === 1000){
                    const donutChefRole = message.guild.roles.find(r => r.name === "Donut Chef");
                    message.member.addRole(donutChefRole).catch(err => console.log(err));
                    message.channel.send(`${message.author} you got the **${donutChefRole.name}** role for cooking donuts 1000 times!`)
                }
            }else{
                const newUser = new infoSchema({
                    guildID: message.guild.id,
                    userID: message.author.id,
                    eatenDonuts: 0,
                    feededDonuts: 0,
                    cookedDonuts: 1,
                });
                newUser.save().catch(err => errors.databaseError(message, err));
            }
        });
    }

    const amount = 2;
    const eggsCost = 2;
    const flourCost = 1;
    const milkCost = 1;

    invSchema.findOne({
        guildID: message.guild.id,
        userID: message.author.id
    }, (err, inventory) => {
        if (err) return errors.databaseError(message, err);

        const result = Math.floor(Math.random() * 100);
        if (!inventory || inventory.items.eggs < eggsCost || inventory.items.flour < flourCost || inventory.items.milk < milkCost){
            const notEnoughEmbed = new Discord.RichEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setColor("#FF0000")
                .setDescription(`You need **${eggsCost} eggs, ${flourCost} flour, and ${milkCost} milk** to cook **${amount} donuts**`);
            return message.channel.send(notEnoughEmbed);
        }

        if (result <= 30){
            const failEmbed = new Discord.RichEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setColor("#FF0000")
                .setDescription("**OH MAN!** you just burnt your donuts. I guess it will just go to waste.");
            message.channel.send(failEmbed);
        }else{
            const attachment = new Discord.Attachment(path.resolve(__dirname, "../../images/donut.png").toString(), "donut.png");
            const cookedEmbed = new Discord.RichEmbed()
                .attachFile(attachment)
                .setThumbnail("attachment://donut.png")
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setColor(bot.settings.embedColor)
                .setDescription(`You just cooked ${amount} donuts. Looks yummy!`);
            message.channel.send(cookedEmbed);
            inventory.items.donuts += amount;
            addCookedDonut();
        }

        inventory.items.eggs -= eggsCost;
        inventory.items.flour -= flourCost;
        inventory.items.milk -= milkCost;
        inventory.save().catch(err => errors.databaseError(message, err));
    });

};

module.exports.config = {
    name: "cook",
    usage: "cook amount",
    description: "Cook 2 donuts at once",
    aliases: [],
    noalias: "No Alias",
    permission: [],
    enabled: true
};