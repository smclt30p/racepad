class Main {

	private stopwatch: Stopwatch;
	private speedometer: Speedometer;
    private displayHandler: Windows.System.Display.DisplayRequest;
    private ifmanager: InterfaceManager;

    public constructor() {

        this.ifmanager = new InterfaceManager();
        this.ifmanager.setupToolbar();

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
            try { this.displayHandler.requestRelease(); } catch (e) { console.log("Exception thrown in release: " + e); }
		});

		Windows.UI.WebUI.WebUIApplication.addEventListener("leavingbackground", () => {
            try { this.displayHandler.requestActive(); } catch (e) { console.log("Exception thrown in request: " + e); }
		});

        this.speedometer.restoreOdo();
		this.speedometer.start();

	}

};

window.onload = () => { new Main().main(); };