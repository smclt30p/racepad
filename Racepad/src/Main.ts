class Main {

	private stopwatch: Stopwatch;
	private speedometer: Speedometer;

	public constructor() {

		this.stopwatch = new Stopwatch(document.getElementById("time"));
		this.speedometer = new Speedometer(document.getElementById("speed"));

		this.stopwatch.start();
		this.speedometer.start();
	}

	public main(): void {

		Windows.UI.WebUI.WebUIApplication.addEventListener("enteredbackground", () => {
			console.log("SUSPENDING");
		});

	}

};

window.onload = () => { new Main().main(); };