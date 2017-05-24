class Main {

	private stopwatch: Stopwatch;
	private speedometer: Speedometer;
    private displayHandler: Windows.System.Display.DisplayRequest;
    private ifmanager: InterfaceManager = InterfaceManager.getInterfaceManager();

    public constructor() {

        this.ifmanager.setupToolbar();

		this.stopwatch = new Stopwatch();
		this.speedometer = new Speedometer();
        this.displayHandler = new Windows.System.Display.DisplayRequest();

	}

    public main(): void {

        this.displayHandler.requestActive();

        let self = this;

        (async function() {

            self.ifmanager.statusBarShowMobileGuarded();
            self.speedometer.restoreOdo();
            self.speedometer.start();

        })();

    }

};

window.onload = () => { new Main().main(); };