const Discord = require("discord.js");
const invSchema = require("../../utils/Schemas/invSchema");
const infoSchema = require("../../utils/Schemas/infoSchema");
const errors = require("../../utils/errors");
const path = require("path");

module.exports.run = async (bot, message, args, messageArray) => {
    if (message.channel.id !== bot.settings.botCommandsChannel) return;
    const roleToAdd = message.guild.roles.find(r => r.name === "Super Eater");

    invSchema.findOne({
        guildID: message.guild.id,
        userID: message.author.id
    }, (err, inventory) => {
        if (err) return errors.databaseError(message, err, __filename);

        if (!inventory || inventory.items.superdonut <= 0) {
            const noDonutEmbed = new Discord.RichEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setColor(bot.settings.embedColor)
                .setDescription("You don't have a super donut to eat!");
            message.channel.send(noDonutEmbed);
        }else{
            inventory.items.superdonut--;
            inventory.save().catch(err => errors.databaseError(err, message, __filename));
            message.member.addRole(roleToAdd).catch(err => console.log(err));
            const attachment = new Discord.Attachment(path.resolve(__dirname, "../../images/superdonut.png").toString(), "superdonut.png");
            const ateDonut = new Discord.RichEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setColor(bot.settings.embedColor)
                .attachFile(attachment)
                .setThumbnail("attachment://superdonut.png")
                .setDescription(`You have eaten a Super Donut! You got the **${roleToAdd.name}** role!`);
            message.channel.send(ateDonut);
        }
    })
};

module.exports.config = {
    name: "superdonut",
    usage: "superdonut",
    description: "Eat one Super Donut and have an amazing role!",
    aliases: [],
    noalias: "No Alias",
    permission: [],
    enabled: true
};