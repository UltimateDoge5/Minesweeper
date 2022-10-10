class AudioPlayer {
	music: HTMLAudioElement;
	private flag: HTMLAudioElement;
	private unflag: HTMLAudioElement;
	private uncover: HTMLAudioElement;
	private gameover: HTMLAudioElement;
	private win: HTMLAudioElement;

	constructor() {
		this.music = new Audio("/audio/music.mp3");
		this.music.loop = true;

		this.flag = new Audio("/audio/flag.mp3");
		this.unflag = new Audio("/audio/unflag.mp3");
		this.unflag.volume = 0.75
		this.uncover = new Audio("/audio/uncover.mp3");
		this.gameover = new Audio("/audio/gameover.mp3");
		this.win = new Audio("/audio/win.mp3");
	}

	public play(sound: Sound) {
		if (!this[sound].paused) {
			(this[sound].cloneNode(true) as HTMLAudioElement).play();
		} else {
			this[sound].play();
		}
	}

	public stop(sound: Sound) {
		this[sound].pause();
		this[sound].currentTime = 0;
	}
}

type Sound = "uncover" | "flag" | "unflag" | "gameover" | "win";

export default AudioPlayer;
