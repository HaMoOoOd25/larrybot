const Discord = require("discord.js");
const giphy = require('giphy-api')('kEecNEDJz9HznzuvgRdJSi5h8IPVvKT5');
module.exports.run = async (bot, message, args, messageArray) => {

    const searchName = args.join(" ") || "random";

    giphy.search({
        q: searchName,
        rating: "pg"
    }).then(function (res) {
        const gifURL = res.data[Math.floor(Math.random() * res.data.length)].images.downsized_large.url;

        const embed = new Discord.RichEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setColor(bot.settings.embedColor)
            .setDescription("**Here is a gif for you.**")
            .setImage(gifURL)
            .setFooter("GIF by: giphy.com");
        message.channel.send(embed);
    }).catch((err) => {
        const errorEmbed = new Discord.RichEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setColor("#FF0000")
            .setDescription("Can't get that GIF right now. Try with different search phrase.")
        message.channel.send(errorEmbed);
    });




};

module.exports.config = {
    name : "gif",
    usage: "gif search phrase",
    description: "get a random GIF or search for GIF.",
    aliases: [],
    noalais: "No Alias",
    permission: [],
    enabled: true
};