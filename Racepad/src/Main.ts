class Main {

	private stopwatch: Stopwatch;
	private speedometer: Speedometer;
	private displayHandler: Windows.System.Display.DisplayRequest;

	public constructor() {

		this.stopwatch = new Stopwatch();
		this.speedometer = new Speedometer();
		this.displayHandler = new Windows.System.Display.DisplayRequest();
	}

    public main(): void {

        if (Windows.Foundation.Metadata.ApiInformation.isTypePresent("Windows.UI.ViewManagement.StatusBar")) {

            let statusbar = Windows.UI.ViewManagement.StatusBar.getForCurrentView();
            statusbar.showAsync();

        }

		Windows.UI.WebUI.WebUIApplication.addEventListener("enteredbackground", () => {
			this.speedometer.backupOdo();
			this.displayHandler.requestRelease();
		});

		Windows.UI.WebUI.WebUIApplication.addEventListener("leavingbackground", () => {
			this.displayHandler.requestActive();
		});

		this.speedometer.restoreOdo();

		this.speedometer.start();

	}

};

window.onload = () => { new Main().main(); };