const Discord = require("discord.js");
const giphy = require('giphy-api')('kEecNEDJz9HznzuvgRdJSi5h8IPVvKT5');
module.exports.run = async (bot, message, args, messageArray) => {

    const action = "stare";
    const victim = message.mentions.users.first() || args[0] || "none";

    let text = `${victim}, ${message.author} ${action}d at you.`;

    if (victim.id === bot.user.id) {
        text = `You can't ${action} at me, I am gonna ${action} at you instead.`
    } else if (victim === "me") {
        text = `I don't know how you can ${action} at yourself but here.`
    }else if (victim === "yourself"){
        return message.channel.send(`${message.author}, I can't I am a bot.`)
    }else if (victim === "none"){
        text = `Who? I am just gonna ${action} at you instead.`
    }


    giphy.search({
        q: action
    }).then(function (res) {
        const gifURL = res.data[Math.floor(Math.random() * res.data.length)].images.downsized_large.url;

        const embed = new Discord.RichEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setColor(bot.settings.embedColor)
            .setDescription(text)
            .setImage(gifURL)
            .setFooter("GIF by: giphy.com");
        message.channel.send(embed);
    }).catch((err) => {
        const errorEmbed = new Discord.RichEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setColor("#FF0000")
            .setDescription("Can't get that GIF right now. Try with different search phrase.");
        message.channel.send(errorEmbed);
        console.log(err);
    });




};

module.exports.config = {
    name : "stare",
    usage: "stare @someone",
    description: "stare at someone.",
    aliases: [],
    noalais: "No Alias",
    permission: [],
    enabled: true
};