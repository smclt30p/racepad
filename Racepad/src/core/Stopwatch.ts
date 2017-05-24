class Stopwatch {

	private seconds: number;
	private dateType: Date;
	private interval: number;
	private running: boolean;

    private ifmanager: InterfaceManager = InterfaceManager.getInterfaceManager();

	public constructor() {

		this.tearDownWatch();
        this.running = false;

        this.ifmanager.addTimeClickListener(() => {

			if (this.running) {
				this.pause();
				return;
			}

			this.start();

		});

        this.ifmanager.addTimeLongClickListener(() => this.reset());

	}

	public reset(): void {

        clearInterval(this.interval);
        this.ifmanager.setTimeText("--:--:--");
		this.tearDownWatch();
		this.running = false;

	}

	public pause(): void {
		clearInterval(this.interval);
		this.running = false;
	}

	public start(): void {

		this.interval = setInterval(() => {

			this.seconds += 1;
			this.dateType.setTime(this.seconds * 1000);

			let hours = this.formatTime(this.dateType.getUTCHours());
			let minutes = this.formatTime(this.dateType.getUTCMinutes());
			let seconds = this.formatTime(this.dateType.getUTCSeconds());

            this.ifmanager.setTimeText(hours + ":" + minutes + ":" + seconds);

		}, 1000);

		this.running = true;

	}

	private tearDownWatch(): void {
		this.seconds = 0;
		this.dateType = new Date();
		this.dateType.setTime(0);
	}

	private formatTime(raw: number): string {

		if (raw == 0) {
			return "00";
		}

		if ((raw.toString()).length == 1) {
			return "0" + raw;
		}

		return raw.toString();
	}
}