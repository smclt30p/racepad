class Speedometer {

	private display: HTMLElement;
	private odo: HTMLElement;
	private odoDesc: HTMLElement;

	private geolocator: Windows.Devices.Geolocation.Geolocator;
	private maxavg: MaxAverageDisplay;

	private odometer: number = 0;
	private trip1: number = 0;
	private trip2: number = 0;

	private DISPLAY_ODO = 0;
	private DISPLAY_TRIP1 = 1;
	private DISPLAY_TRIP2 = 2;

	private currentDisplay: number = 0;

	private clearOdoTimer: number;

	public constructor() {

		this.maxavg = new MaxAverageDisplay();

		this.display = document.getElementById("speed");
		this.odo = document.getElementById("odometer");
		this.odoDesc = document.getElementById("odometer-desc");

		this.odo.addEventListener("click", () => {
			this.switchDisplayMode();
		});

		this.odo.addEventListener("touchstart", () => {
			this.clearOdoTimer = setTimeout(() => {
				this.clearOdo();
			}, 1000);
		});

		this.odo.addEventListener("touchend", () => {
			clearTimeout(this.clearOdoTimer);
		});

		this.displayOdodmeterData();

	};

	private clearOdo(): void {

		switch (this.currentDisplay) {

			case this.DISPLAY_TRIP1:
				this.trip1 = 0;
				this.displayOdodmeterData();
				break;
			case this.DISPLAY_TRIP2:
				this.trip2 = 0;
				this.displayOdodmeterData();
		}

	};

	private switchDisplayMode(): void {

		this.currentDisplay++;
		if (this.currentDisplay == 3) this.currentDisplay = 0;

		switch (this.currentDisplay) {

			case this.DISPLAY_ODO:
				this.odoDesc.innerHTML = "odo | km";
				this.displayOdodmeterData();
				break;
			case this.DISPLAY_TRIP1:
				this.odoDesc.innerHTML = "trip 1 | km";
				this.displayOdodmeterData();
				break;
			case this.DISPLAY_TRIP2:
				this.odoDesc.innerHTML = "trip 2 | km";
				this.displayOdodmeterData();
				break;
		}

	};

	private displayOdodmeterData(): void {

		switch (this.currentDisplay) {

			case this.DISPLAY_ODO:
				this.odo.innerHTML = (this.odometer / 1000).toFixed(2);
				break;
			case this.DISPLAY_TRIP1:
				this.odo.innerHTML = (this.trip1 / 1000).toFixed(2);
				break;
			case this.DISPLAY_TRIP2:
				this.odo.innerHTML = (this.trip2 / 1000).toFixed(2);
				break;
		}

	}

	public start() : void {

		Windows.Devices.Geolocation.Geolocator.requestAccessAsync()
			.then((value: Windows.Devices.Geolocation.GeolocationAccessStatus) => {

				if (value != Windows.Devices.Geolocation.GeolocationAccessStatus.allowed) {
					this.display.innerHTML = "ERR";
					return;
				}

				this.geolocator = new Windows.Devices.Geolocation.Geolocator();
				this.geolocator.desiredAccuracy = 1;
				this.geolocator.reportInterval = 500;
				this.geolocator.onstatuschanged = (value) => {
					if (value.status == Windows.Devices.Geolocation.PositionStatus.ready) {
						this.display.innerHTML = "0.0";
					}
				};

				this.geolocator.onpositionchanged = (details) => {

					if (details.position.coordinate.speed.toString() == "NaN") return;

					let speed = (details.position.coordinate.speed * 3.6).toFixed(1);

					this.odometer += details.position.coordinate.speed;
					this.trip1 += details.position.coordinate.speed;
					this.trip2 += details.position.coordinate.speed;

					this.maxavg.pushSpeed(details.position.coordinate.speed);
					this.display.innerHTML = speed;
					this.displayOdodmeterData();
					this.maxavg.refresh();
				};

		});

	};

	public restoreOdo(): void {

		this.maxavg.restoreMax();

		let container: Windows.Storage.ApplicationDataContainer = this.getStorageContainer();

		if (container.values["data"] == undefined || container.values["data"] == null) {
			container.values["data"] = this.backupOdo();
		}

		let backup = JSON.parse(container.values["data"]);
		this.odometer = backup.odo;
		this.trip1 = backup.trip1;
		this.trip2 = backup.trip2;
		this.displayOdodmeterData();

	};

	public backupOdo(): void {

		this.maxavg.backupMax();

		let backup = { "odo": null, "trip1": null, "trip2":null };

		backup.odo = this.odometer;
		backup.trip1 = this.trip1;
		backup.trip2 = this.trip2;

		let store = JSON.stringify(backup);
		let container: Windows.Storage.ApplicationDataContainer = this.getStorageContainer();

		container.values["data"] = store;

	};

	private getStorageContainer(): Windows.Storage.ApplicationDataContainer {

		let appdata: Windows.Storage.ApplicationData = Windows.Storage.ApplicationData.current;
		let settings: Windows.Storage.ApplicationDataContainer = appdata.localSettings;
		let container: Windows.Storage.ApplicationDataContainer = null;

		if (!settings.containers.hasKey("odoData")) {
			container = settings.createContainer("odoData", Windows.Storage.ApplicationDataCreateDisposition.always);
		} else {
			container = settings.containers.lookup("odoData");
		}

		return container;

	}

}