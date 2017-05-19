class Main {

	private stopwatch: Stopwatch;
	private speedometer: Speedometer;
	private batterytime: BatteryTimeDisplay;
	private displayHandler: Windows.System.Display.DisplayRequest;

	public constructor() {

		this.stopwatch = new Stopwatch();
		this.speedometer = new Speedometer();
		this.batterytime = new BatteryTimeDisplay();
		this.displayHandler = new Windows.System.Display.DisplayRequest();
	}

	public main(): void {

		Windows.UI.WebUI.WebUIApplication.addEventListener("enteredbackground", () => {
			this.speedometer.backupOdo();
			this.displayHandler.requestRelease();
		});

		Windows.UI.WebUI.WebUIApplication.addEventListener("leavingbackground", () => {
			this.displayHandler.requestActive();
		});

		this.speedometer.restoreOdo();

		this.batterytime.start();
		this.speedometer.start();

	}

};

window.onload = () => { new Main().main(); };