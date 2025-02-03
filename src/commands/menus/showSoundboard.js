const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const Constants = require('../../constants.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sb')
    .setDescription('Show the soundboard.'),
  async execute(interaction) {
    // discord limitations
    const NumButtonsMax = 5; // per row
    const NumRowsMax = 5;

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
      .slice(0, NumButtonsMax * NumRowsMax) // TODO support more than 25 sounds at some point
      .reduce(chunkButton, [])
      .map(arr => new ActionRowBuilder().addComponents(arr));

    await interaction.reply({
      content: `Click on the corresponding button to play a sound.`,
      components: rows
    });
  },
};