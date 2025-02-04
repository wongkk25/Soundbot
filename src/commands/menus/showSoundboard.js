const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const Constants = require('../../constants.js');
const { maxNumSounds } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sb')
		.setDescription('Show the soundboard.'),
	async execute(interaction) {
		// discord limitations
		const NumButtonsPerRowMax = 5;
		const NumRowsMax = 5;

		const buildButton = (filename) => {
			const soundName = filename.split('.')[0];
			return new ButtonBuilder()
				.setCustomId(filename)
				.setLabel(soundName)
				.setStyle(ButtonStyle.Secondary);
		};

		const chunkArr = (chunkSize) => {
			return (acc, item, idx) => {
				const chunkIdx = Math.floor(idx / chunkSize);
				if (!acc[chunkIdx]) {
					acc[chunkIdx] = [];
				}
				acc[chunkIdx].push(item);
				return acc;
			};
		};

		const buttons = fs.readdirSync(Constants.AssetsFolder)
			.map(buildButton)
			.slice(0, maxNumSounds);

		const numSounds = buttons.length;
		await interaction.reply({
			content: `Click on the corresponding button to play a sound. Number of avilable sounds: ${numSounds}/${maxNumSounds}`,
			flags: MessageFlags.Ephemeral,
		});

		const sections = buttons.reduce(chunkArr(NumButtonsPerRowMax), [])
			.map(arr => new ActionRowBuilder().addComponents(arr))
			.reduce(chunkArr(NumRowsMax), []);

		sections.forEach(rows => {
			interaction.followUp({ components: rows, flags: MessageFlags.Ephemeral });
		});
	},
};