const Discord = require("discord.js");
const coinsSchema = require("../../utils/Schemas/coinSchema");
const errors = require("../../utils/errors");
const path = require("path");

module.exports.run = (bot, message, args, messageArray) => {
    if (message.channel.id !== bot.settings.botCommandsChannel) return;

    //deposit amount
    let toDeposit = 0;

    coinsSchema.findOne({
        guildID: message.guild.id,
        userID: message.author.id
    }, (err, coins) => {
        if (err) return errors.databaseError(message, err, __filename);

        if (!coins || coins.coins < 1) {
            const noCoinsEmbed = new Discord.RichEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setColor("FF0000")
                .setDescription("You don't have anything to deposit.");
            message.channel.send(noCoinsEmbed);
        }
        else {

            if (args[0] === "all"){
                toDeposit = coins.coins;
            }
            else if (!isNaN(args[0])){
                toDeposit = parseInt(args[0]);
            }
            else{
                return errors.wrongCommandUsage(message, this.config.usage)
            }

            if (toDeposit <= 0) {
                const noZero = new Discord.RichEmbed()
                    .setAuthor(message.author.tag, message.author.avatarURL)
                    .setColor("FF0000")
                    .setDescription("You can't deposit nothing silly!");
                return message.channel.send(noZero);
            }

            if (toDeposit > coins.coins){
                const notEnough = new Discord.RichEmbed()
                    .setAuthor(message.author.tag, message.author.avatarURL)
                    .setColor("FF0000")
                    .setDescription("You don't have that amount of coins.");
                return message.channel.send(notEnough);
            }
            coins.coins = coins.coins - toDeposit;
            coins.bank = coins.bank + toDeposit;
            coins.save().catch(err => errors.databaseError(message, err, __filename));

            const attachment = new Discord.Attachment(path.resolve(__dirname, "../../images/coin.png").toString(), "coin.png");
            const depositedEmbed =  new Discord.RichEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setTitle("Deposit")
                .attachFile(attachment)
                .setThumbnail('attachment://coin.png')
                .setColor(bot.settings.embedColor)
                .setDescription(`💰 **Wallet:** \`${coins.coins}\` \n🏦 **Bank:** \`${coins.bank}\` \n💳 **Deposited:** \`${toDeposit}\``);
            message.channel.send(depositedEmbed);
        }
    });
};

module.exports.config = {
    name: "deposit",
    usage: "deposit amount",
    description: "Deposit your money into the bank to keep it safe.",
    aliases: ["dep"],
    permission: [],
    enabled: true
};