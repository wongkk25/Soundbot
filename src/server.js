
const fs = require('fs');
const path = require('path');
// const { OpusEncoder } = require('@discordjs/opus');
const { clientId, guildId, token } = require('./config.json');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, '../cmds');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
		console.log(`No command matching ${interaction.commandName} was found.`);
		return;
	}

  try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});

client.on(Events.MessageReactionAdd, (msg) => {
  // Keeps audio from playing while bot adds initial reactions
  if (msg.count <= 1) {
    return
  }

  //Searches through sound object to find sound that matches reaction
  let CurrentBoard = msg.message.embeds[0].title
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
      if (options[i].emoji === msg.emoji.name) {
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
        msg.channel.send('Could not play sound. Check bot logs for details.');
      }
    }

    PlaySoundOverVoiceChannel(VoiceChannel, results.character, results.name, results.emoji)
  }
});

client.once(Events.ClientReady, readyClient => {
  // readyClient.registry
  //   .registerCommandsIn(path.join(__dirname, '../cmds'))

  console.log(`${readyClient.user.tag} has logged in.`);
});

client.login(token);
