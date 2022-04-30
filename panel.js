const rrModel = require('../../models/reactionRoles')
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js')
const { intersect } = require('mathjs')

module.exports = {
	name: "reaction-panel",
	path: "reaction-roles/panel.js",
  category: "reaction",
  premium: true,
	description: "Reaction menu panel.",
  options: [
    {
      name: "embed",
      description: "provide content what members will see",
      type: "STRING",
      required: true
    }
  ],
   

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

	async execute(interaction, client) {

    const namedropdownem = interaction.options.getString("embed")

    const noneperm = new MessageEmbed()
		.setTitle("You cant use that command")
		.setDescription("You need 'MANAGE_GUILD' Permissions to use this command ")
		if(!interaction.member.permissions.has("MANAGE_GUILD")) return await interaction.reply({embeds: [noneperm]})
        
        const guildData = await rrModel.findOne({ guildId: interaction.guildId
        });
          if(!guildData?.roles)
            return interaction.followUp(
            "There is no role inside of this server"
          );
    
          const options = guildData.roles.map((x) => {
            const role = interaction.guild.roles.cache.get(x.roleId);
            const server = interaction.guild
    
              if(!role){
                  interaction.followUp('❌ | No role(s) found!')
             
                  // oh okay then! and also can u fix the permissions so only "MANAGE_ROLES" can use add role remove and panel cmd
              }
            return {
              label: role.name,
              value: role.id,
              description: x.roleDescription || "No description",
              emoji: x.roleEmoji
            };
          });
    
          const panelEmbed = new MessageEmbed()
          .setTitle(`${interaction.guild.name} role system`)
          .setDescription(namedropdownem)
          .setColor("RANDOM")
    
          const components = [
            new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId("reaction-roles").setMaxValues(1).addOptions(options)
          )
          ];
    
          interaction.reply({ embeds: [ panelEmbed ], components });
          

      
        }
    
};