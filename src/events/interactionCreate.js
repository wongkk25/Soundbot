const { createReadStream } = require('node:fs');
const { Events, MessageFlags } = require('discord.js');
const { createAudioPlayer, createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const Constants = require('../constants.js');

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
			const connection = getVoiceConnection(interaction.guildId);
			const player = createAudioPlayer();

			player.on('stateChange', (oldState, newState) => {
				console.log(`Audio player transitioned from the ${oldState.status} state to the ${newState.status} state`);
			});
			player.on('error', error => {
				console.error(`Error: ${error.message}`);
			});

			try {
				connection.subscribe(player);

				const location = `${Constants.AssetsFolder}/${interaction.customId}`;
				const resource = createAudioResource(createReadStream(location));
				player.play(resource);
				await interaction.deferUpdate();
			}
			catch (error) {
				console.error(`Error when button was clicked: ${error}`);
				await interaction.reply({ content: 'There was an issue playing the sound. The bot is likely not connected. Please try again later.', flags: MessageFlags.Ephemeral });
			}
		}
		else {
			return;
		}
	},
};