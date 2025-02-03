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
		const guildId = newState.guild.id;
		const numConnectedMembers = channel.members?.size || 0;

		console.log(`Voice connection transitioned from the ${oldState.status} state to the ${newState.status} state. Number of connected members to channel ${channel.id}: ${numConnectedMembers}`);

		const disconnect = (gid) => {
			const connection = getVoiceConnection(gid);
			connection?.destroy();
		};

		const connect = (ch, gid) => {
			if (getVoiceConnection(gid)) return;

			joinVoiceChannel({
				channelId: ch.id,
				guildId: ch.guildId,
				adapterCreator: ch.guild.voiceAdapterCreator,
			});
		};

		// If there is only 1 member left and a connection is defined, that last member will be the bot
		// In this case, disconnect to save resources
		if (numConnectedMembers <= 1 && getVoiceConnection(guildId)) {
			disconnect(guildId);
		}
		// else, connect the bot only if a real user connects first
		else if (numConnectedMembers >= 1) {
			connect(channel, guildId);
		};
	},
};