const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const Constants = require('../../constants.js');

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

		const chunkButton = (acc, item, idx) => {
			const chunkIdx = Math.floor(idx / NumButtonsPerRowMax);
			if (!acc[chunkIdx]) {
				acc[chunkIdx] = [];
			}
			acc[chunkIdx].push(item);
			return acc;
		};

		const rows = fs.readdirSync(Constants.AssetsFolder)
			.map(buildButton)
			// TODO support more than 25 sounds at some point
			.slice(0, NumButtonsPerRowMax * NumRowsMax)
			.reduce(chunkButton, [])
			.map(arr => new ActionRowBuilder().addComponents(arr));

		await interaction.reply({
			content: 'Click on the corresponding button to play a sound.',
			components: rows,
		});
	},
};