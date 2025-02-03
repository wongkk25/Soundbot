const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const Constants = require('../../constants.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sb')
    .setDescription('Show the soundboard.'),
  async execute(interaction) {
    const NumButtonsMax = 5; // discord limitation per row; 5 rows max for 25 sounds total

    const buildButton = (soundName) => {
      return new ButtonBuilder()
        .setCustomId(soundName)
        .setLabel(soundName)
        .setStyle(ButtonStyle.Secondary);
    };

    const chunkButton = (acc, item, idx) => {
      const chunkIdx = Math.floor(idx / NumButtonsMax)
      if (!acc[chunkIdx]) {
        acc[chunkIdx] = []
      }
      acc[chunkIdx].push(item)
      return acc
    };

    const rows = fs.readdirSync(Constants.AssetsFolder)
      .map(buildButton)
      .reduce(chunkButton, [])
      .map(arr => new ActionRowBuilder().addComponents(arr));

    await interaction.reply({
      content: `Click on the corresponding button to play a sound.`,
      components: rows
    });
  },
};