const Discord = require("discord.js");
const coinsSchema = require("./Schemas/coinSchema");
const errors = require("./errors");
const path = require("path");

module.exports.drop = (bot) => {

    const guild = bot.guilds.get(bot.settings.guildID);
    const channel = guild.channels.get(bot.settings.mainChatChannel);

    const min = Math.ceil(20);
    const max = Math.floor(100 + 1);
    const prize = Math.floor(Math.random() * (max - min) + min);

    const attachment = new Discord.Attachment(path.resolve(__dirname, "../images/coin.png").toString(), "coin.png");
    const dropEmbed = new Discord.RichEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setTitle("New Drop")
        .attachFile(attachment)
        .setThumbnail("attachment://coin.png")
        .setColor(bot.settings.embedColor)
        .setDescription(`A donut has appeared, the first person to **.eat** it is rewarded ${prize} amount of coins.`);
    channel.send(dropEmbed).then(async msg => {

        const filter = m => m.author !== m.author.bot;

        const messageCollector = channel.createMessageCollector(filter, {});

        messageCollector.on('collect', collectedMsg => {
            if (collectedMsg.content.toLowerCase() === ".eat"){
                messageCollector.stop();
                const claimedEmbed = new Discord.RichEmbed()
                    .setDescription(`${collectedMsg.author} has claimed the ${prize} coins!`)
                    .setColor(bot.settings.embedColor);
                channel.send(claimedEmbed);

                coinsSchema.findOne({
                    guildID: guild.id,
                    userID: collectedMsg.author.id
                }, (err, res) => {
                    if (err) return errors.databaseError(message, err, __filename);

                    if (!res){
                        const newData = coinsSchema({
                            guildID: guild.id,
                            userID: collectedMsg.author.id,
                            coins: prize,
                            bank:0
                        });
                        newData.save().catch(err => errors.databaseError(message, err, __filename));
                    }else{
                        res.coins += prize;
                        res.save().catch(err => errors.databaseError(message, err, __filename));
                    }
                })
            }
        });
    });
};