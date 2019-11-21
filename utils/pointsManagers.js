const Discord = require("discord.js");

const errors = require("./errors");

const messagesSchema = require("./Schemas/messagesSchema");

const messagesCoolDownSet = new Set();
//-------------------------------

module.exports.messagePoints = (bot, message) => {
    if (messagesCoolDownSet.has(message.author.id)) return;

    messagesSchema.findOne({
        guildID: message.guild.id,
        userID: message.author.id
    }, (err, res) => {
        if (err) return errors.databaseError(message, err);

        if (!res){
            const newData = new messagesSchema({
                guildID: message.guild.id,
                userID: message.author.id,
                points: 1
            });
            newData.save().catch(err => errors.databaseError(message, err));
        }else{
            res.points += 1;

            res.save().catch(err => errors.databaseError(message, err));
        }
        messagesCoolDownSet.add(message.author.id);

        setTimeout(function () {
            messagesCoolDownSet.delete(message.author.id);
        }, 60000);
    });
};