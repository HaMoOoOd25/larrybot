const Discord = require("discord.js");
const infoSchema = require("../../utils/Schemas/infoSchema");
const errors = require("../../utils/errors");

module.exports.run = (bot, message, args, messageArray) => {
    if (message.channel.id !== bot.settings.botCommandsChannel) return;
    const member = message.mentions.members.first() ||
        message.guild.members.find(m => m.user === message.mentions.users.first())
        || message.member;

    //Username, Avatar, Nickname, highest role, join date, account creation date, donuts eaten, donuts feed, donuts cooked.

    infoSchema.findOne({
        guildID: message.guild.id,
        userID: member.id
    }, (err, user) => {
        if (err) return errors.databaseError(message, err);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

        let joinDate = `${member.joinedAt.getDate()}-${months[member.joinedAt.getMonth()]}-${member.joinedAt.getFullYear()}`;
        let createDate = `${member.user.createdAt.getDate()}-${months[member.joinedAt.getMonth()]}-${member.user.createdAt.getFullYear()}`;
        let info = "";
        info += `**__General Info__**\n\n`;
        info += `**Username:** ${member.user.tag}\n`;
        info += `**Nickname:** ${member.nickname || "none"}\n`;
        info += `**Highest Role:** ${member.highestRole}\n`;
        info += `**Join Date:** ${joinDate}\n`;
        info += `**Account Creation:** ${createDate}\n`;
        info += `\n**__Donuts Info__**\n\n`;
        info += `**Donuts Eaten:** ${user.eatenDonuts}\n`;
        info += `**Donuts Feed:** ${user.feededDonuts}\n`;
        info += `**Times Cooked:** ${user.cookedDonuts}\n`;

        const embed = new Discord.RichEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL)
            .setColor(bot.settings.embedColor)
            .setTitle(`${member.user.username}'s info`)
            .setThumbnail(member.user.avatarURL)
            .setDescription(info);
        message.channel.send(embed);
    });
};

module.exports.config = {
    name : "info",
    usage: "info @user",
    description: "Check some cool information about you.",
    aliases: ["whois"],
    permission: [],
    enabled: true
};