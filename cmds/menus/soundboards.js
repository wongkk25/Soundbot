const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('path');
const Config = require('../../src/config')
// const GIFS = Config.GIFS;

// TODO for the love of god clean all this shit up

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sb')
    .setDescription('Show the soundboard.'),
  async execute(message) {
    // console.log(message)
    //Instantiates a sounds object to store information about this characters sounds
    let Sounds = new Object();

    //func. that looks at the character folder and adds an entry to the Sounds obj.
    function RetreiveAudioClips() {
      let i = 0;
      // const folder = `./assets/sounds/${args}`;
      const folder = `./assets/sounds/sample`;
      fs.readdirSync(folder).forEach(file => {
        let character = file.split("_")[0]
        let name = file.split("_")[1]
        let emoji = file.split("_")[3].split('.')[0]
        Sounds[i] = { character, name, emoji }
        i++;
      })
    }

    // Creates new character specific menu
    const Menu = new EmbedBuilder()
      .setColor('#4C18EB')
      // .setTitle(`${args.charAt(0).toUpperCase() + args.slice(1)} Soundboard`)
      .setTitle('Soundboard')
      .setDescription('Click on the corresponding reaction to play a sound')
      // .setThumbnail(`${GIFS[args]}`)
      // .addFields({ name: '\u200B', value: '\u200B' })

    console.log(Sounds);

    // Iterates through the Sounds obj. and append a field to the menu for every sound\
    function BuildMenu() {
      const fields = [
        { name: '\u200B', value: '\u200B' }
      ]
      let i = 0;
      for (i; i < Object.keys(Sounds).length; i++) {
        // let character = Sounds[i].character
        let emoji = Sounds[i].emoji;
        let name = Sounds[i].name.split('.')[0];
        console.log(emoji + ", " + name);
        fields.push({ name: name, value: emoji, inline: true });
      }
      Menu.addFields(fields);
    }

    RetreiveAudioClips();
    // console.log(Sounds);
    BuildMenu();
  

    // function NumberOfSounds() {
    //   let SoundCount = Object.keys(Sounds).length;
    //   let remainder = SoundCount % 3;

    //   if (remainder === 0) {
    //     return
    //   } else if (remainder === 1) {
    //     Menu.addField('-', "-", true)
    //     Menu.addField('-', "-", true)
    //   } else if (remainder === 2) {
    //     Menu.addField('-', "-", true)
    //   }
    // }

    // NumberOfSounds()

    // console.log(Menu);

    message.channel.send({ embeds: [Menu] })
      .then((sentMessage) => {
        Object.values(Sounds).forEach(val => {
          sentMessage.react(val.emoji)
        })
      })
  }
};