const { Events } = require('discord.js');
const { channelId } = require('../config.json');
const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
	name: Events.VoiceStateUpdate,
	async execute(oldState, newState) {
		const channel = await newState.guild.channels.fetch(channelId);
		const numConnectedMembers = channel.members?.size || 0;

		console.log(`Voice connection transitioned from the ${oldState.status} state to the ${newState.status} state. Number of connected members to channel ${channel.id}: ${numConnectedMembers}`);

		// If there is only 1 member left and a connection is defined, that last member will be the bot
		// In this case, disconnect to save resources
		if (numConnectedMembers <= 1 && getVoiceConnection(channel.guildId)) {
			console.log(`Disconnecting bot from channel ${channel.id}`);
			getVoiceConnection(channel.guildId)?.destroy();
		}
		// else, connect the bot only if a real user connects first
		else if (numConnectedMembers >= 1) {
			// Since the event handler runs every time someone connects/disconnects, the connection can already exist
			// Don't establish another connection in that case
			if (getVoiceConnection(channel.guildId)) {
				console.log(`Connection already exists for channel ${channel.id}, guild ${channel.guildId}`);
				return;
			}

			console.log(`Connecting bot to channel ${channel.id}, guild ${channel.guildId}`);
			joinVoiceChannel({
				channelId: channel.id,
				guildId: channel.guildId,
				adapterCreator: channel.guild.voiceAdapterCreator,
			});
		};
	},
};