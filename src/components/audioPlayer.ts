class AudioPlayer {
	music: HTMLAudioElement;

	constructor() {
		this.music = new Audio("/audio/music.mp3");
		this.music.loop = true;
	}

	public play(sound: Sound) {}
}

type Sound = "uncover" | "flag" | "unflag" | "mine" | "gameover" | "win";

export default AudioPlayer;
