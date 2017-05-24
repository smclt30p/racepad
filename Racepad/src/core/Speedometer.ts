class Speedometer {

	private geolocator: Windows.Devices.Geolocation.Geolocator;
	private maxavg: MaxAverageDisplay;

	private odometer: number = 0;
	private trip1: number = 0;
	private trip2: number = 0;

	private DISPLAY_ODO = 0;
	private DISPLAY_TRIP1 = 1;
	private DISPLAY_TRIP2 = 2;

	private currentDisplay: number = 0;

    private ifmanager: InterfaceManager = InterfaceManager.getInterfaceManager();

	public constructor() {

		this.maxavg = new MaxAverageDisplay();

        this.ifmanager.addOdometerClickListener(() => this.switchDisplayMode());
        this.ifmanager.addOdometerLongClickListener(() => this.clearOdo());

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
                this.ifmanager.setOdometerDescription("odo | km");
				this.displayOdodmeterData();
				break;
			case this.DISPLAY_TRIP1:
                this.ifmanager.setOdometerDescription("trip 1 | km");
				this.displayOdodmeterData();
				break;
			case this.DISPLAY_TRIP2:
                this.ifmanager.setOdometerDescription("trip 2 | km");
				this.displayOdodmeterData();
				break;
		}

	};

	private displayOdodmeterData(): void {

		switch (this.currentDisplay) {

            case this.DISPLAY_ODO:
                this.ifmanager.setOdometerText((this.odometer / 1000).toFixed(2));
				break;
			case this.DISPLAY_TRIP1:
                this.ifmanager.setOdometerText((this.trip1 / 1000).toFixed(2));
				break;
			case this.DISPLAY_TRIP2:
                this.ifmanager.setOdometerText((this.trip2 / 1000).toFixed(2));
				break;
		}

	}

    public async start(): Promise<void> {

        let accessStatus: Windows.Devices.Geolocation.GeolocationAccessStatus = await Windows.Devices.Geolocation.Geolocator.requestAccessAsync();

        if (accessStatus != Windows.Devices.Geolocation.GeolocationAccessStatus.allowed) {
            this.ifmanager.setSpeedometerText("DEN");
            return;
        }

        this.geolocator = new Windows.Devices.Geolocation.Geolocator();

        this.geolocator.desiredAccuracy = 1; // 1 meter
        this.geolocator.reportInterval = 1000; // 1 second

        this.geolocator.onstatuschanged = (value: Windows.Devices.Geolocation.StatusChangedEventArgs) => {
            if (value.status == Windows.Devices.Geolocation.PositionStatus.ready) {
                this.ifmanager.setSpeedometerText("0.0");
            }
        };

        this.geolocator.onpositionchanged = (details: Windows.Devices.Geolocation.PositionChangedEventArgs) => {

            if (details.position.coordinate.speed.toString() == "NaN") return;

            let speed = (details.position.coordinate.speed * 3.6).toFixed(1);

            this.odometer += details.position.coordinate.speed;
            this.trip1 += details.position.coordinate.speed;
            this.trip2 += details.position.coordinate.speed;

            this.maxavg.pushSpeed(details.position.coordinate.speed);
            this.ifmanager.setSpeedometerText(speed);
            this.displayOdodmeterData();
            this.maxavg.refresh();
        };


    };

	public restoreOdo(): void {

		this.maxavg.restoreMax();
        let olddata = SettingsManager.getManager().getSetting("odoData", this.serialize());
        let backup = JSON.parse(olddata);
		this.odometer = backup.odo;
		this.trip1 = backup.trip1;
		this.trip2 = backup.trip2;
		this.displayOdodmeterData();

	};

	public backupOdo(): void {

		this.maxavg.backupMax();
        SettingsManager.getManager().putSetting("odoData", this.serialize());

	};

    private serialize(): string {

        let backup = { "odo": null, "trip1": null, "trip2": null };

        backup.odo = this.odometer;
        backup.trip1 = this.trip1;
        backup.trip2 = this.trip2;

        return JSON.stringify(backup);

    }

}