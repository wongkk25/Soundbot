const { createReadStream } = require('node:fs');
const { Events, MessageFlags } = require('discord.js');
const { createAudioResource, demuxProbe, getVoiceConnection } = require('@discordjs/voice');
const { channelId } = require('../config.json');
const Constants = require('../constants.js');
const audioPlayerManager = require('../audioPlayerSingleton.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.log(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			}
			catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
				}
				else {
					await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
				}
			}
		}
		else if (interaction.isButton()) {
			try {
				const probeAndCreateResource = async (readableStream) => {
					const { stream, type } = await demuxProbe(readableStream);
					return createAudioResource(stream, { inputType: type });
				};

				if (!getVoiceConnection(interaction.guild.id)) {
					throw new Error('The bot is not currently connected to a voice channel.');
				}

				const channel = await interaction.guild.channels.fetch(channelId);
				if (!channel.members.has(interaction.user.id)) {
					throw new Error('You are not currently in the voice channel, you cannot play sounds at this time.');
				}

				const player = audioPlayerManager.getAudioPlayer();
				const location = `${Constants.AssetsFolder}/${interaction.customId}`;
				const resource = await probeAndCreateResource(createReadStream(location));
				player.play(resource);
				await interaction.deferUpdate();
			}
			catch (error) {
				console.error(`Error when button was clicked: ${error}`);
				await interaction.reply({ content: error.toString(), flags: MessageFlags.Ephemeral });
			}
		}
		else {
			return;
		}
	},
};