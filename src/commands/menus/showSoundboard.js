const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sb')
    .setDescription('Show the soundboard.'),
  async execute(message) {
    const listSounds = () => {
      const folder = `./assets/sounds/sample`; // todo remove sample
      return fs.readdirSync(folder).map(file => {
        const name = file.split("_")[1]; // todo update indices
        const emoji = file.split("_")[3].split('.')[0];
        return { name, emoji };
      });
    };

    const buildSoundboardMenu = (sounds) => {
      const buildFields = (sounds) => {
        const soundFields = sounds.map(sound => {
          const soundName = sound.name.split('.')[0];
          console.log(sound.emoji + ", " + soundName);
          return { name: soundName, value: sound.emoji, inline: true }
        });
        const spaceField = { name: '\u200B', value: '\u200B' }
        return [spaceField].concat(soundFields);
      };

      const soundboardMenu = new EmbedBuilder()
        .setColor('#4C18EB')
        .setTitle('Soundboard')
        .setDescription('Click on the corresponding button to play a sound.');
      const fields = buildFields(sounds);
      soundboardMenu.addFields(fields);
      return soundboardMenu;
    }

    const sounds = listSounds();
    const soundboardMenu = buildSoundboardMenu(sounds);

    message.channel.send({ embeds: [soundboardMenu] })
      .then((sentMessage) => {
        Object.values(sounds).forEach(val => {
          sentMessage.react(val.emoji)
        });
      });
  }
};