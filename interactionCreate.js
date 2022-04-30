const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const cooldownsDB = require("../../Structures/Schemas/cooldownsDB");
const channelsDB = require("../../Structures/Schemas/channelsDB");
const { red, yellow } = require("../../Structures/colors.json");
const { botsDevID } = require("../../Structures/config.json");
const premiumSchema = require("../../models/premium")
const customCommandModel = require("../../models/customCommands")
const BlacklistSchema = require("../../models/blacklist-server")
const polls = require("../../models/poll");
const acceptedrule = require("../../models/rules")
const premiumGuildSchema = require("../../models/premium-guild");

module.exports = {
	name: "interactionCreate",
	path: "Interaction/interactionCreate.js",
	/**
	 * @param {CommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const { guildId, guild, user, member } = interaction;
		if (!interaction.guild)
			return (
				interaction.reply({
					embeds: [new MessageEmbed().setColor(red).setDescription("🟥 Sorry slash commands only works in guilds.").setTimestamp()],
				}) && client.commands.delete(interaction.commandName)
			);
		if (!interaction.channel)
			return (
				interaction.reply({
					embeds: [new MessageEmbed().setColor(red).setDescription("🟥 Sorry slash commands dont work in DM.").setTimestamp()],
				}) && client.commands.delete(interaction.commandName)
			);

			

		if (client.maintenance && interaction.user.id != botsDevID) {
			const Response = new MessageEmbed().setTitle("👷‍♂️ MAINTENANCE 👷‍♂️").setDescription("Sorry the bot will be back shortly when everything is working correctly.").setColor(red);

			return interaction.reply({ embeds: [Response] });
		}

		if (interaction.isCommand() || interaction.isContextMenu()) {

			const command = client.commands.get(interaction.commandName);
			if (command) {
				const CommandName = command.name.replace(" ", "").toLowerCase();

				
				
				const BlacklistErr = new MessageEmbed()
				.setTitle("This server is blacklisted")
				.setDescription("This server has been banned from using any bot commands!")
				const blacklisted = await BlacklistSchema.findOne({ Server: interaction.guild.id })
				if(blacklisted)
				 return interaction.reply
				({ embeds: [BlacklistErr], ephemeral: true})
				
				const NotPremium = new MessageEmbed()
					.setTitle("You are not a premium user")
					.setDescription("You cannot use this command!")
					if(command.premium && !(await premiumSchema.findOne({ User: interaction.user.id })))
					 return interaction.reply
					({ embeds: [NotPremium], ephemeral: true})

				
					

				


				if (command.cooldown) {
					const cooldown = client.cooldowns.get(`${guildId}||${CommandName}||${user.id}`) - Date.now();
					const time = Math.floor(cooldown / 1000) + "";
					console.log(cooldown)

					const Data = await cooldownsDB.findOne({
						Details: `${guildId}||${CommandName}||${user.id}`,
					});

					

					if (!Data) {
						await cooldownsDB.create({
							Details: `${guildId}||${CommandName}||${user.id}`,
							Time: Date.now() + command.cooldown,
						});
					}

				

					if (client.cooldowns.has(`${guildId}||${CommandName}||${user.id}`))
						return interaction.reply({
							embeds: [new MessageEmbed().setColor(yellow).setDescription(`🟥 ${interaction.user} The __cooldown__ for **${command.name}** is still active.\nYou have to wait for another \` ${time.split(".")[0]} \` *second(s)*.`)],
							ephemeral: true,
						});

					// if (user.id != guild.ownerId) {
					client.cooldowns.set(`${guildId}||${CommandName}||${user.id}`, Date.now() + command.cooldown);
					// }

					setTimeout(async () => {
						client.cooldowns.delete(`${guildId}||${CommandName}||${user.id}`);
						await cooldownsDB.findOneAndDelete({
							Details: `${guildId}||${CommandName}||${user.id}`,
						});
					}, command.cooldown);
				}
			}

			if (command) {

				
			const Data = await channelsDB.findOne({
				GuildID: guild.id,
			});

			if (!Data && member.permissions.has("ADMINISTRATOR")) return command.execute(interaction, client);

			

				

			
			command.execute(interaction, client);
		} else {
			const customCommand = await customCommandModel.findOne({ commandNme: interaction.commandName})

			if(!customCommand) return interaction.reply({ content: "An err occured"});

			return interaction.reply({ content: customCommand.response})
		}

			
		}
		
		if(interaction.isSelectMenu()) {

						if(interaction.customId !== 'reaction-roles') return;

						await interaction.deferReply({ ephemeral: true })
						const roleId = interaction.values[0];
						const role = interaction.guild.roles.cache.get(roleId)
						const memberRoles = interaction.member.roles;
						console.log(memberRoles)
					
						const hasRole = memberRoles.cache.has(roleId);
					
						if(hasRole) {
						  memberRoles.remove(roleId);
						  interaction.followUp(`${role.name} has been removed from you!`)
						} else {
						  memberRoles.add(roleId)
						  interaction.followUp(`I have added ${role.name} to you!`)
						}
						
					  }
		
	},
};