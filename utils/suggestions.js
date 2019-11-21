const Discord = require("discord.js");

module.exports.suggest = (bot, author, message) => {

    let suggestions = message.content;
    message.delete();

    const suggestionEmbed = new Discord.RichEmbed()
        .setAuthor(`${message.guild.name} Suggestions`)
        .setColor(bot.settings.embedColor)
        .addField("Suggestion", suggestions, false)
        .addField("Suggested By", `${message.author.tag}`, false)
        .setDescription(`React with ⬆️ to upvote and ⬇️ to downvote`)
    message.channel.send(suggestionEmbed).then(async msg => {
        await msg.react("⬆️");
        await msg.react("⬇️");
    })
};