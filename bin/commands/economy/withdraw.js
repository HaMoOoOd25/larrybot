const Discord = require("discord.js");
const coinsSchema = require("../../utils/Schemas/coinSchema");
const errors = require("../../utils/errors");
const path = require("path");

module.exports.run = (bot, message, args, messageArray) => {
    if (message.channel.id !== bot.settings.botCommandsChannel) return;

    //deposit amount
    let toWithdraw = 0;

    coinsSchema.findOne({
        guildID: message.guild.id,
        userID: message.author.id
    }, (err, coins) => {
        if (err) return errors.databaseError(message, err, __filename);

        if (!coins || coins.bank < 1) {
            const noCoinsEmbed = new Discord.RichEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setColor("FF0000")
                .setDescription("You don't have anything to withdraw.");
            message.channel.send(noCoinsEmbed);
        }
        else {

            if (args[0] === "all"){
                toWithdraw = coins.bank;
            }
            else if (!isNaN(args[0])){
                toWithdraw = parseInt(args[0]);
            }
            else{
                return errors.wrongCommandUsage(message, this.config.usage)
            }

            if (toWithdraw <= 0) {
                const noZero = new Discord.RichEmbed()
                    .setAuthor(message.author.tag, message.author.avatarURL)
                    .setColor("FF0000")
                    .setDescription("You can't withdraw nothing silly!");
                return message.channel.send(noZero);
            }

            if (toWithdraw > coins.bank){
                const notEnough = new Discord.RichEmbed()
                    .setAuthor(message.author.tag, message.author.avatarURL)
                    .setColor("FF0000")
                    .setDescription("You don't have that amount of coins.");
                return message.channel.send(notEnough);
            }
            coins.coins = coins.coins + toWithdraw;
            coins.bank = coins.bank - toWithdraw;
            coins.save().catch(err => errors.databaseError(message, err, __filename));

            const attachment = new Discord.Attachment(path.resolve(__dirname, "../../images/coin.png").toString(), "coin.png");
            const depositedEmbed =  new Discord.RichEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setTitle("Deposit")
                .attachFile(attachment)
                .setThumbnail('attachment://coin.png')
                .setColor(bot.settings.embedColor)
                .setDescription(`💰 **Wallet:** \`${coins.coins}\` \n🏦 **Bank:** \`${coins.bank}\` \n💳 **Withdrawn:** \`${toWithdraw}\``);
            message.channel.send(depositedEmbed);
        }
    });
};

module.exports.config = {
    name: "withdraw",
    usage: "withdraw",
    description: "Withdraw your money from the bank.",
    aliases: ["with"],
    permission: [],
    enabled: true
};