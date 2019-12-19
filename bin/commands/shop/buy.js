const Discord = require("discord.js");
const path = require("path");
const fs = require("fs");
const errors = require("../../utils/errors");
const coinSchema = require("../../utils/Schemas/coinSchema");
const invSchema = require("../../utils/Schemas/invSchema");

module.exports.run = (bot, message, args, messageArray) => {
    if (message.channel.id !== bot.settings.botCommandsChannel) return;
    //Add item when purchased....
    function addItem(item, amount){
        invSchema.findOne({
            guildID: message.guild.id,
            userID: message.author.id
        }, (err, inventory) => {
            if (err) return errors.databaseError(message, err);
            if (inventory){
                inventory.items[item] += amount;
                inventory.save().catch(err => errors.databaseError(message, err));
            }else{
                const newInv = new invSchema({
                    guildID: message.guild.id,
                    userID: message.author.id,
                    items: {
                        donuts: 0,
                        superdonut: 0,
                        eggs: 0,
                        flour: 0,
                        milk: 0
                    }
                });
                newInv.items[item] += amount;
                newInv.save().catch(err => errors.databaseError(message, err));
            }
        })
    }

    //Buy the item and deduct money
    function buyItem(cost, item, amount){
        coinSchema.findOne({
            guildID: message.guild.id,
            userID: message.author.id
        }, (err, user) => {
            if (err) return errors.databaseError(message, err);

            if (!user || user.coins < cost || user.coins <= 0){
                return errors.noEnoughCoins(message, user.coins || 0, cost, item);
            }else{
                addItem(item, amount);
                user.coins -= cost;
                user.save().catch(err => errors.databaseError(message, err));
                const purchasedEmbed = new Discord.RichEmbed()
                    .setAuthor(message.author.tag, message.author.avatarURL)
                    .setColor(bot.settings.embedColor)
                    .setThumbnail(message.guild.iconURL)
                    .setDescription(`You have purchased ${amount} **${item}** for **${cost}** coins.`);
                message.channel.send(purchasedEmbed);
            }
        });
    }

    let itemToBuy = args[0];
    let amount = 0;
    let cost = 0;
    let found = false;

    if (!isNaN(args[1])){
        amount = parseInt(args[1]);
    }else {
        amount = 1;
    }

    if (args < 1) return errors.wrongCommandUsage(message, this.config.usage);

    const itemsJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../Configuration/shopitems.json")).toString());
    const items = itemsJson.items;

    for (let i = 0; i<items.length; i++){
        if (itemToBuy.toLowerCase() === items[i].name){
            itemToBuy = items[i].name;
            amount = items[i].amount * amount;
            cost = items[i].price * amount;
            found = true;
        }
    }

    if (found === true){
        buyItem(cost, itemToBuy, amount)
    }else{
        errors.notFoundItem(message, itemToBuy);
    }
};

module.exports.config = {
    name: "buy",
    usage: "buy [Item Name] amount",
    description: "Buy from our cool shop!.",
    aliases: ["purchase"],
    permission: [],
    enabled: true
};