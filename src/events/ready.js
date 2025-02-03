const { Events } = require('discord.js');
const { channelId } = require('../config.json');
const { joinVoiceChannel, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');

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
		
		voiceConnection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
			console.log('Connection is in the Ready state!');
		});

		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};