const rrModel = require('../../models/reactionRoles')
const { Client, CommandInteraction, MessageEmbed } = require('discord.js')
const { intersect } = require('mathjs')

module.exports = {
	name: "reaction-r-role",
	path: "reaction-roles/remove-role.js",
    category: "reaction",
	premium: true,
	description: "Remove a role to the reaction role dropdown menu.",
    options: [
        {
            name: "role",
            description: "role to be removed",
            type: "ROLE",
            required: "true",
        },
    ],

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

	async execute(interaction, client) {

        const noneperm = new MessageEmbed()
		.setTitle("You cant use that command")
		.setDescription("You need 'MANAGE_GUILD' Permissions to use this command ")
		if(!interaction.member.permissions.has("MANAGE_GUILD")) return await interaction.reply({embeds: [noneperm]})

        const role = interaction.options.getRole("role")
       

        const guildData = await rrModel.findOne({ guildId: interaction.guildId })
        if(!guildData)
         return interaction.followUp(
             "there is no roles inside of this server!"
             )

             const guildRoles = guildData.roles;

             const findRole = guildRoles.find(x => x.roleId === role.id);
             if(!findRole) return interaction.reply("the role is not added to roles list")

             const filteredRoles = guildRoles.filter(x => x.roleId !== role.id)
             guildData.roles = filteredRoles;

             await guildData.save()

             interaction.reply(`Removed: ${role.name}`)
    }
};