class Main {

	private stopwatch: Stopwatch;
	private speedometer: Speedometer;
    private ifmanager: InterfaceManager = InterfaceManager.getInterfaceManager();
    private display: Display;

    public constructor() {

        this.ifmanager.setupToolbar();

		this.stopwatch = new Stopwatch();
        this.speedometer = new Speedometer();
        this.display = new Display();

	}

    public main(): void {

        Windows.UI.WebUI.WebUIApplication.addEventListener("enteredbackground", () => {

            try {
                this.display.releaseRequest();
            } catch (e) {
                console.log("Shit in release: " + e);
            }

        });

        Windows.UI.WebUI.WebUIApplication.addEventListener("leavingbackground", () => {

            try {
                this.display.requestAwake();
            } catch (e) {
                console.log("Shit in request: " + e);
            }

        });

        let self = this;

        (async function() {

            self.ifmanager.statusBarShowMobileGuarded();
            self.speedometer.restoreOdo();
            self.speedometer.start();

        })();

    }

};

window.onload = () => { new Main().main(); };