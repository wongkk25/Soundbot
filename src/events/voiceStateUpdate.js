const { Events } = require('discord.js');
const { channelId } = require('../config.json');
const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
	name: Events.VoiceStateUpdate,
	async execute(oldState, newState) {
		const fetchChannel = async (cid, channels) => {
			return channels.cache.get(cid) ||
				await channels.fetch(cid);
		};

		const channel = await fetchChannel(channelId, newState.guild.channels);
		const guildId = channel.guild.id;
		const numConnectedMembers = channel.members?.size || 0;

		console.log(`Voice connection transitioned from the ${oldState.status} state to the ${newState.status} state. Number of connected members to channel ${channel.id}: ${numConnectedMembers}`);

		// If there is only 1 member left and a connection is defined, that last member will be the bot
		// In this case, disconnect to save resources
		if (numConnectedMembers <= 1 && getVoiceConnection(guildId)) {
			console.log(`Disconnecting bot from channel ${channel.id}`);
			const connection = getVoiceConnection(guildId);
			connection?.destroy();
		}
		// else, connect the bot only if a real user connects first
		else if (numConnectedMembers >= 1) {
			// Since the event handler runs every time someone connects/disconnects, the connection can already exist
			// Don't establish another connection in that case
			if (getVoiceConnection(guildId)) {
				console.log(`Connection already exists for channel ${channel.id}, guild ${guildId}`);
				return;
			}

			console.log(`Connecting bot to channel ${channel.id}, guild ${guildId}`);
			joinVoiceChannel({
				channelId: channel.id,
				guildId: channel.guildId,
				adapterCreator: channel.guild.voiceAdapterCreator,
			});
		};
	},
};