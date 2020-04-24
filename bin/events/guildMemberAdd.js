const Discord = require("discord.js");
const errors = require("../utils/errors");

module.exports = async (bot, member) => {

    //welcome channel
    const welcomeChannel = member.guild.channels.get(bot.settings.welcomeChannel);

    //Verification values
    const verifyChannel = member.guild.channels.find(c => c.name === bot.settings.verificationChannel);
    const role = member.guild.roles.find(r => r.name === "Unverified");
    let tries = 0;
    let verify = false;

    const welcomeEmbed = new Discord.RichEmbed()
        .setAuthor(member.user.tag, member.user.avatarURL)
        .setColor(bot.settings.embedColor)
        .setThumbnail(member.guild.iconURL)
        .setDescription(`Hi, how are you today? ${member.user} hope you enjoy your stay at **the Donut Shop**!\n\n` +
            `You are the **${member.guild.memberCount}**th member`);

    //If no verify channel or unverified role, just ignore
    if (!verifyChannel || !role) {
        return welcomeChannel.send(welcomeEmbed);
    }

    //Check if new member has the plain role. if yes then skip verification
    await setTimeout(function () {
        if (member.roles.find(r => r.name === "Plain")) {
            return welcomeChannel.send(welcomeEmbed);
        }
    }, 10000);

    //Give unverified role
    member.addRole(role).catch(e => {
        errors.roleManageFail(e, __filename);
        verifyChannel.send(`${member}, an error has occured while in the verification proccess. Please Contact HaMoOoOd25#7712.`);
    });

    //Start a collector
    const filter = m => m.author.id === member.user.id;
    const collector = verifyChannel.createMessageCollector(filter, {
        time: 90000, //90000 (15 mins)
        Max: 3
    });

    collector.on('collect', m => {
        m.delete(2000).catch();
        if (m.content.toLowerCase() === "!verify") {
            verify = true;
            collector.stop();
        } else {
            if (tries === 3) {
                verify = false;
                collector.stop();
                return;
            }
            tries++;
            verifyChannel.send(`${m.author}, you didn't type \`!Verify\` correctly. You got ${3 - tries} tries left.`).then(m => {
                m.delete(5000);
            });
        }
    });

    collector.on('end', async collected => {
        if (verify === true) {
            member.removeRole(role, "Verified").catch(e => {
                errors.roleManageFail(e, __filename);
                verifyChannel.send(`${member}, an error has occured while in the verification proccess. Please Contact HaMoOoOd25#7712.`);
            });
            verifyChannel.send(`Cool! You are now allowed to the server. Have Fun!`).then(m => {
                m.delete(5000);
            });
            welcomeChannel.send(welcomeEmbed);
        } else {
            try {
                await member.user.send("You failed to verify yourself!");
            } catch (e) {}
            member.kick("Didn't verify correctly for three times.").catch(e => {
                errors(e, __filename);
            });
        }
    });
};