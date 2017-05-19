class Speedometer {

	private display: HTMLElement;
	private geolocator: Windows.Devices.Geolocation.Geolocator;

	public constructor(display: HTMLElement) {
		this.display = display;
	};

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
					let speed = (details.position.coordinate.speed * 3.6).toFixed(1);
					if (speed == "NaN") return;
					this.display.innerHTML = speed;
				};

		});

	};

}