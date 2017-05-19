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

	private getStorageContainer(): Windows.Storage.ApplicationDataContainer {

		let appdata: Windows.Storage.ApplicationData = Windows.Storage.ApplicationData.current;
		let settings: Windows.Storage.ApplicationDataContainer = appdata.localSettings;
		let container: Windows.Storage.ApplicationDataContainer = null;

		if (!settings.containers.hasKey("maxData")) {
			container = settings.createContainer("maxData", Windows.Storage.ApplicationDataCreateDisposition.always);
		} else {
			container = settings.containers.lookup("maxData");
		}

		return container;

	}

	public backupMax(): void {
		let container = this.getStorageContainer();
		container.values["max"] = this.globalMax;
		this.refresh();
	};

	public restoreMax(): void {
		let container = this.getStorageContainer();
		if (container.values["max"] == undefined || container.values["max"] == null) {
			container.values["max"] = 0;
		};
		this.globalMax = container.values["max"];
		this.refresh();
	};

};