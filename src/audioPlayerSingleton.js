const { createAudioPlayer } = require('@discordjs/voice');

let audioPlayer;

module.exports = {
	getAudioPlayer: (create = true) => {
		if (audioPlayer) {
			console.log('Audio player already instantiated, retrieving...');
			return audioPlayer;
		}
		else if (!create) {
			console.log('Audio player creation flag set to false, skipping creation...');
			return;
		}
		console.log('Audio player not instantiated, creating one now');
		const player = createAudioPlayer();
		player.on('stateChange', (oldState, newState) => {
			console.log(`Audio player transitioned from the ${oldState.status} state to the ${newState.status} state`);
		});
		player.on('error', error => {
			console.error(`Audio player error: ${error.message}`);
		});
		audioPlayer = player;
		return audioPlayer;
	},
};
