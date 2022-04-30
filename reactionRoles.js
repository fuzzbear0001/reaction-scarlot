const { string } = require('mathjs')
const mongoose = require('mongoose')

/**
 * Roles structures
 * -roleId string;
 * -roleDescription: string
 * -roleEmoji: string
 */
const Schema = new mongoose.Schema({
    guildId: string,
    roles: Array,
})

module.exports = mongoose.model('reaction-roles', Schema);