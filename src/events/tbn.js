const { Events, MessageFlags } = require('discord.js');

module.exports = {
  name: Events.MessageReactionAdd,
  async execute(interaction) {
    console.log("Registered message reaction add");
    console.log(interaction);
    // Keeps audio from playing while bot adds initial reactions
    if (interaction.count <= 1) {
      return
    }
  
    //Searches through sound object to find sound that matches reaction
    let CurrentBoard = interaction.message.embeds[0].title
    let CurrentCharacter = CurrentBoard.split(' ')[0]
  
    let Sounds = {};
  
    function RetreiveAudioClips() {
      let i = 0;
      const folder = `./assets/sounds/${CurrentCharacter}`;
      fs.readdirSync(folder).forEach(file => {
        let character = file.split("_")[0]
        let name = file.split("_")[1]
        let emoji = file.split("_")[2].split('.')[0]
        Sounds[i] = { character, name, emoji }
        i++;
      })
    }
    RetreiveAudioClips()
  
    var results = {};
    var options = Sounds;
  
    for (i = 0; i < Object.keys(options).length; i++) {
      for (key in options[i]) {
        if (options[i].emoji === interaction.emoji.name) {
          results = options[i];
        }
      }
    }
    // Plays sound
    if (results) {
      const VoiceChannel = client.channels.cache.get(channel)
  
      function PlaySoundOverVoiceChannel(VoiceChannel, Location, Name, Emoji) {
        if (fs.existsSync(path.join(__dirname, `../assets/sounds/${Location}/${Name}_${Emoji}.mp3`))) {
          VoiceChannel.join().then((connection) => {
            connection.play(path.join(__dirname, `../assets/sounds/${Location}/${Name}_${Emoji}.mp3`));
          })
        } else {
          console.log(`Could not play sound; file ${Location}/${Name}_${Emoji}.mp3 not found.`);
          interaction.channel.send('Could not play sound. Check bot logs for details.');
        }
      }
  
      PlaySoundOverVoiceChannel(VoiceChannel, results.character, results.name, results.emoji)
    }
  }
};