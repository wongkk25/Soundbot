const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sb')
    .setDescription('Show the soundboard.'),
  async execute(interaction) {

    // temporary
    const getSoundName = (filename) => {
      return filename.split("_")[1];
    };

    const buildButton = (soundName) => {
      return new ButtonBuilder()
        .setCustomId(soundName)
        .setLabel(soundName)
        .setStyle(ButtonStyle.Secondary);
    };

    
    const chunkButton = (acc, item, idx) => {
      const chunkIdx = Math.floor(idx / numButtonsMax)
      if(!acc[chunkIdx]) {
        acc[chunkIdx] = []
      }
      acc[chunkIdx].push(item)
      return acc
    };

    const numButtonsMax = 5; // discord limitation per row; 5 rows max for 25 sounds total
    const folder = `./assets/sounds/sample`; // todo remove sample
    const rows = fs.readdirSync(folder)
      .map(getSoundName)
      .map(buildButton)
      .reduce(chunkButton, [])
      .map(arr => new ActionRowBuilder().addComponents(arr));

    await interaction.reply({
      content: `Click on the corresponding button to play a sound.`,
      components: rows
    });
  },
};