const rrModel = require('../../models/reactionRoles')
const { Client, CommandInteraction, MessageEmbed } = require('discord.js')
const { intersect } = require('mathjs')

module.exports = {
	name: "reaction-add",
	path: "reaction-roles/add-role.js",
    category: "reaction",
	premium: true,
	description: "Add a role to the reaction role dropdown menu.",
    options: [
        {
            name: "role",
            description: "First role to be assigned",
            type: "ROLE",
            required: "true",
        },
        {
            name: "description",
            description: "description of this role",
            type: "STRING",
            required: false
        },
        {
            name: "emoji",
            description: "emoji for the role",
            type: "STRING",
            required: false
        },
	{
	    name: "role2",
	    description: "The oppisite role of the first role!",
            type: "ROLE",
            required: "false",
	},
	{
            name: "emoji2",
            description: "Emoji for the oppisite role!",
            type: "STRING",
            required: false
        },
    ],

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

	async execute(interaction, client) {

        const role = interaction.options.getRole("role")
        const roleDescription = interaction.options.getString("description") 
        const roleEmoji = interaction.options.getString("emoji") || null;
	const roleEmoji2 = interaction.options.getString("emoji2") || null;
	const role2 = interaction.options.getString("role2") || null;
		
        const rolehighEmbed = new MessageEmbed()
        .setTitle("Role cant be added")
        .setDescription("The role provided is higher or equel to me so i cannot add it")
        const AddedEmbed = new MessageEmbed()
        .setTitle("Role added")
        .setDescription("Role has been added use /reaction-panel")

        if(role.position >= interaction.guild.me.roles.highest.position) return interaction.reply({ embeds: [rolehighEmbed]})

        const guildData = await rrModel.findOne({ guildId: interaction.guildId })

        const newRole = {
            roleId: role.id,
            roleDescription,
            roleEmoji,
	    role2Id: role2.id,
	    roleEmoji2
        }

        if(guildData) {
            let  roleData = guildData.roles.find((x) => x.roleId === role.id )
	    let  roleData2 = guildData.roles.find((x) => x.role2Id === role.id )

            if(roleData) {
                roleData = newRole;
            } else {
                guildData.roles = [...guildData.roles, newRole]
            }

            await guildData.save()
        } else {
            await rrModel.create({
                guildId: interaction.guildId,
                roles: newRole
            })
        }
        interaction.reply({ embeds: [AddedEmbed]})
    }
}
