class MaxAverageDisplay {


	private desc: HTMLElement;
	private display: HTMLElement;

	private speeds: number[];

	private DISPLAY_MAX = 0;
	private DISPLAY_AVG = 1;

	private currentDisplay: number = 0;
	private globalMax: number = 0;

	public constructor() {

		this.desc = document.getElementById("avgdesc");
		this.display = document.getElementById("avgdisp");
		this.speeds = [];

		this.display.addEventListener("click", () => {
			this.switchDisplay();
		});

	};

	private switchDisplay(): void {

		this.currentDisplay = this.currentDisplay == 1 ? 0 : 1;
		this.refresh();

	};

	public pushSpeed(speed: number): void {

		if (this.speeds.length > 100) {
			this.speeds.shift();
		}

		this.speeds.push(speed);

	};

	private displayAverage(): void {

		if (this.speeds.length == 0) {
			this.display.innerHTML = "---";
			return;
		};

		let total = 0;
		for (let i = 0; i < this.speeds.length; i++) {
			total += this.speeds[i];
		}

		let avg = total / this.speeds.length;

		this.display.innerHTML = (avg * 3.6).toFixed(1);

	};

	private displayMaximum(): void {

		if (this.speeds.length == 0) {
			this.display.innerHTML = "---";
		};

		for (let i = 0; i < this.speeds.length; i++) {

			if (this.speeds[i] > this.globalMax) {
				this.globalMax = this.speeds[i];
			}

		}

		this.display.innerHTML = (this.globalMax * 3.6).toFixed(1);

	}; 

	public refresh(): void {

		switch (this.currentDisplay) {

			case this.DISPLAY_AVG:
				this.displayAverage();
				this.desc.innerHTML = "avg | km/h";
				break;
			case this.DISPLAY_MAX:
				this.displayMaximum();
				this.desc.innerHTML = "max | km/h"
				break;

		};

	};

	public backupMax(): void {
        SettingsManager.getManager().putSetting("max", this.globalMax.toString());
		this.refresh();
	};

	public restoreMax(): void {
        this.globalMax = parseFloat(SettingsManager.getManager().getSetting("max", "0"));
		this.refresh();
	};

};