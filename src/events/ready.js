const { Events } = require('discord.js');
const { channelId } = require('../config.json');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		const channel = await client.channels.fetch(channelId);
		const voiceConnection = joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guildId,
			adapterCreator: channel.guild.voiceAdapterCreator,
		});

		voiceConnection.on('stateChange', (oldState, newState) => {
			console.log(`Voice connection transitioned from the ${oldState.status} state to the ${newState.status} state`);
		});

		console.log(`Bot logged in as ${client.user.tag}`);
	},
};