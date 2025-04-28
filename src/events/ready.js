const { Events } = require('discord.js');
const { channelId } = require('../config.json');
const { joinVoiceChannel } = require('@discordjs/voice');
const { getAudioPlayer } = require('../audioPlayerSingleton.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		// if users already are in the voice channel, join it on start
		const channel = await client.channels.fetch(channelId);
		const numConnectedMembers = channel.members?.size || 0;

		if (numConnectedMembers > 0) {
			console.log(`Members already are connected; connecting bot to channel ${channel.id}, guild ${channel.guild.id}`);
			const channelConnection = joinVoiceChannel({
				channelId: channel.id,
				guildId: channel.guildId,
				adapterCreator: channel.guild.voiceAdapterCreator,
			});
			channelConnection.subscribe(getAudioPlayer());
		}

		console.log(`Bot logged in as ${client.user.tag}`);
	},
};