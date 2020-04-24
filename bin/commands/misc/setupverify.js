const Discord = require("discord.js");
const errors = require("../../utils/errors");

module.exports.run = async (bot, message, args, messageArray) => {


    const botMember = message.guild.members.find(m => m.id === bot.user.id);
    if (!botMember.hasPermission("MANAGE_ROLES")) return message.reply(' I must have `MANAGE_ROLES` permission in order to continue.');
    if (!botMember.hasPermission("MANAGE_CHANNELS")) return message.reply(' I must have `MANAGE_CHANNELS` permission in order to continue.');

    const roleName = "Unverified";
    let role = message.guild.roles.find(r => r.name === roleName);

    let roleStatus;
    let createChannelStatus;
    let successChannels = [];
    let failedChannels = [];

    if (!role) {
        await message.guild.createRole({
            name: roleName,
            position: 1
        }).then(r => {
            console.log(`Created ${r.name} role.`);
            role = r;
            roleStatus = "success";
        }).catch(e => {
            errors(e, __filename);
            roleStatus = `Failed: ${e}`
        });
    } else {
        roleStatus = "success";
    }

    let channelsArray = message.guild.channels.array();

    for (let i = 0; i < channelsArray.length; i++) {
        let channel = channelsArray[i];
        channel.overwritePermissions(role, {
            VIEW_CHANNEL: false
        }).then(updated => {
            successChannels.push(updated.name);
        }).catch(e => {
            errors(e, __filename);
            failedChannels.push(`${channel.name} : ${e}`);
        });
    }
    

    const embed = new Discord.RichEmbed()
        .setAuthor(message.guild.name)
        .setTitle("Verification System")
        .setColor(bot.settings.embedColor)
        .setDescription(`Welcome to the ${message.guild.name} server! Please Verify yourself before joining us!`)
        .addField("Steps", "1- Type `!verify` \n2- Enjoy!")
        .addField("Note", "You have 15 minutes and 3 tries to verify yourself. If you failed to verify " +
            "yourself you will be kicked from the server.");

    let channel = message.guild.channels.find(c => c.name === bot.settings.verificationChannel);

    if (!channel) {
        await message.guild.createChannel(bot.settings.verificationChannel, {
            type: "text",
            permissionOverwrites: [{
                id: message.guild.id,
                deny: ["VIEW_CHANNEL"]
            }]
        }).then(newChannel => {
            channel = newChannel;
            createChannelStatus = "success"
            newChannel.send(embed);
        }).catch(e => {
            errors(e, __filename);
            createChannelStatus = `Failed : ${e}`
        })
    } else {
        
        channel.overwritePermissions(role, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true
        }).then(updated => {
            createChannelStatus = "success";
            channel.send(embed);
        }).catch(e => {
            errors(e, __filename);
            createChannelStatus = `Failed : ${e}`;
        });
        
    }


    let result = "```\n";
    result += "Verification System Setup Is Finished\n\n";
    result += "Results: \n\n";
    result += `- Settings Up ${roleName} role: ${roleStatus}\n\n`;
    result += `- Creating verification channel: ${createChannelStatus}\n\n`
    result += `- Updating all channels permissions: Success: ${successChannels.length} | Failed: ${failedChannels.length}\n\n`
    result += `Error Logs:`

    failedChannels.forEach(function (log) {
        result += `${log}\n`;
    });
    result += "```"

    let resultEmbed = new Discord.RichEmbed()
        .setColor(bot.settings.embedColor)
        .setTitle("Verification System Setup Results")
        .setDescription(result)
    message.channel.send(resultEmbed);
};

module.exports.config = {
    name: "setupverify",
    usage: "setupverify",
    description: "Setup the verification system.",
    aliases: ["setupvs"],
    permission: ["ADMINISTRATOR"],
    enabled: true
};