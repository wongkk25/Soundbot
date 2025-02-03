const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('path');
const Config = require('../../src/config')

// TODO for the love of god clean all this shit up

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sb')
    .setDescription('Show the soundboard.'),
  async execute(message) {
    const listSounds = () => {
      const sounds = {};
      let i = 0;
      const folder = `./assets/sounds/sample`; // todo remove sample
      fs.readdirSync(folder).forEach(file => {
        let character = file.split("_")[0]
        let name = file.split("_")[1]
        let emoji = file.split("_")[3].split('.')[0]
        sounds[i] = { character, name, emoji }
        i++;
      })
      return sounds;
    }

    const buildSoundboardMenu = (sounds) => {
      const buildFields = (sounds) => {
        const fields = [{ name: '\u200B', value: '\u200B' }];
        let i = 0;
        for (i; i < Object.keys(sounds).length; i++) {
          let emoji = sounds[i].emoji;
          let name = sounds[i].name.split('.')[0];
          console.log(emoji + ", " + name);
          fields.push({ name: name, value: emoji, inline: true });
        };
        return fields;
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
    console.log(sounds);
    const soundboardMenu = buildSoundboardMenu(sounds);

    message.channel.send({ embeds: [soundboardMenu] })
      .then((sentMessage) => {
        Object.values(sounds).forEach(val => {
          sentMessage.react(val.emoji)
        });
      });
  }
};