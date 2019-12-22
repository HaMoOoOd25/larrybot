const Discord = require("discord.js");

module.exports = (bot, member) => {

    //Welcome message
    const welcomeChannel = member.guild.channels.get(bot.settings.welcomeChannel);
    const welcomeEmbed = new Discord.RichEmbed()
        .setAuthor(member.user.tag, member.user.avatarURL)
        .setColor(bot.settings.embedColor)
        .setThumbnail(member.guild.iconURL)
        .setDescription(`Hi, how are you today? ${member.user} hope you enjoy your stay at **the Donut Shop**!\n\n` +
        `You are the **${member.guild.memberCount}**th member`);
    welcomeChannel.send(welcomeEmbed);

    //Verification
    const verifyChannel = member.guild.channels.find(c => c.id === bot.settings.verificationChannel);
    const role = member.guild.roles.find(r => r.name === "Plain");

    let tries = 0;
    let verify = false;

    const filter = m => m.author.id === member.user.id;
    const collector = verifyChannel.createMessageCollector(filter, {
        time: 900000,
        Max: 3
    });

    collector.on('collect', m => {
        if (m.content === "!Verify"){
            verify = true;
            collector.stop();
        }else{
            if (tries === 3){
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
        if (verify === true){
            member.addRole(role, "Verified").catch(e => {
                console.log(e);
            });
            verifyChannel.send(`Cool! You are now allowed to the server. Have Fun!`).then(m => {
                m.delete(5000);
            });
        }else{
            try{
                await member.user.send("You failed to verify yourself!");
            }catch (e) {}
            member.kick("Didn't verify correctly for three times.").catch(e => {
                console.log(e);
            });
        }
    });
};