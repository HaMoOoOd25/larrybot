const Discord = require("discord.js");
const path = require("path");
const fs = require("fs");

module.exports.run = (bot, message, args, messageArray) => {
    if (message.channel.id !== bot.settings.botCommandsChannel) return;
    const itemsJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../Configuration/shopitems.json")).toString());
    const items = itemsJson.items;

    let shop = "";
    for(let i = 0; i < items.length; i++){
        shop += `\n\n**__${items[i].name}__** \n**Description:** ${items[i].description} \n**Price:** ${items[i].price} coins`
    }

    const list = new Discord.RichEmbed()
        .setColor(bot.settings.embedColor)
        .setTitle("Items 🛒")
        .setAuthor("Donut Shop", message.guild.iconURL)
        .setThumbnail(message.guild.iconURL)
        .setDescription(shop);

    console.log(items[0].name);

    message.channel.send(list);
};

module.exports.config = {
    name: "shop",
    usage: "shop",
    description: "View our cool shop.",
    aliases: ["store"],
    permission: [],
    enabled: true
};