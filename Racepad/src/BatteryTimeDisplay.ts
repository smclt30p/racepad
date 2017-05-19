class BatteryTimeDisplay {

	private display: HTMLElement;
	private timer: number;

	public constructor() {

		this.display = document.getElementById("battime");

	};
	
	private getBatteryPercentage(): number {

		let batteryReport: Windows.Devices.Power.BatteryReport = Windows.Devices.Power.Battery.aggregateBattery.getReport();
		let perc = Math.round(batteryReport.remainingCapacityInMilliwattHours / batteryReport.fullChargeCapacityInMilliwattHours * 100);
		return perc;

	};

	
	private getTime(): string {

		let date = new Date();
		return date.getHours() + ":" + date.getMinutes();

	};

	public start(): void {

		this.timer = setInterval(() => {

			this.populate();

		}, 60000);

		this.populate();

	};

	private populate(): void {
		this.display.innerHTML = this.getBatteryPercentage() + "% | " + this.getTime();
	};

};