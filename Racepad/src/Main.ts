﻿class Main {

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


        /*
        * This does not need to be relased as the system does that by itself when
        * the user leaves the app. The release method is used when there needs to be
        * dynamic display requests, for example when a e-book is opened in Edge -- the
        * screen should stay on in the ebook but not always, that's when it gets released.
        * We dont to that because the display MUST always stay on while inside the app.
        *
        * More info: https://docs.microsoft.com/en-us/uwp/api/windows.system.display.displayrequest
        */
        Windows.UI.WebUI.WebUIApplication.addEventListener("leavingbackground", () => {
            try {
                self.displayHandler.requestActive();
            } catch (e) {
                console.log("Error requesting displayHandler active: " + e);
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