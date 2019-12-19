const Discord = require("discord.js");
const coinsSchema = require("../../utils/Schemas/coinSchema");
const errors = require("../../utils/errors");
const path = require("path");


module.exports.run = (bot, message, args, messageArray) => {
    if (message.channel.id !== bot.settings.botCommandsChannel) return;

    const member = message.mentions.members.first() || message.mentions.users.first() || message.member;

    let balance = 0;
    let bank = 0;

    coinsSchema.findOne({
        guildID: message.guild.id,
        userID: member.user.id
    }, (err, coins) => {
        if (err) return errors.databaseError(message, err);
        if (coins){
            balance = coins.coins;
            bank = coins.bank;
        }
        const attachment = new Discord.Attachment(path.resolve(__dirname, "../../images/coin.png").toString(), "coin.png");
        const balanceEmbed = new Discord.RichEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setTitle(`${member.user.username}'s balance`)
            .setColor(bot.settings.embedColor)
            .attachFile(attachment)
            .setThumbnail('attachment://coin.png')
            .setDescription(`💰 **Wallet:** \`${balance}\` \n🏦 **Bank:** \`${bank}\``);
        message.channel.send(balanceEmbed);
    });
};

module.exports.config = {
    name: "balance",
    usage: "balance @someone",
    description: "Get yours or someone's balance by mentioning them.",
    aliases: ["bal", "coins", "coin"],
    permission: [],
    enabled: true
};