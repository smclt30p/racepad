class InterfaceManager {

    private PAGE_SPEEDO = 0;
    private PAGE_SETTINGS = 1;

    private currentPage: number = 0;

    private loggerButton = document.getElementById("record-btn");
    private settingsButton = document.getElementById("settings-btn");
    private loggerDesc = document.getElementById("record-desc");
    private setingsPage = document.getElementById("settings-wrap");
    private speedoPage = document.getElementById("speed-wrap");
    private pathPickerButton = document.getElementById("path-pick");
    private logLocationDesc = document.getElementById("log-loc");
    private averageDesc = document.getElementById("avgdesc");
    private averageDisplay = document.getElementById("avgdisp");
    private speedDisplay = document.getElementById("speed");
    private odometerDisplay = document.getElementById("odometer");
    private odometerDescription = document.getElementById("odometer-desc");
    private timeDisplay = document.getElementById("time");

    private odometerClearTimer: number;
    private timeClearTimer: number;

    private static instance: InterfaceManager = null;

    public static getInterfaceManager(): InterfaceManager {
        if (InterfaceManager.instance == null) {
            InterfaceManager.instance = new InterfaceManager();
        }
        return InterfaceManager.instance;
    }

    private constructor() {};

    public setupToolbar(): void {
        window.onresize = this.handleScreenResize;
        this.handleScreenResize();
        this.attachListeners();
    };

    private attachListeners(): void {

        this.settingsButton.addEventListener("click", () => {
            this.switchLayout();
        });

        this.pathPickerButton.addEventListener("click", (event) => {

            var folderPicker = new Windows.Storage.Pickers.FolderPicker();
            folderPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;
            folderPicker.fileTypeFilter.append("*");

            try {

                folderPicker.pickSingleFolderAsync().then((folder: Windows.Storage.StorageFolder) => {

                    if (folder != null) {
                        this.logLocationDesc.innerHTML = folder.path;
                        SettingsManager.getManager().putSetting("path", folder.path);
                    } else {
                        console.log("Picking canceled.")
                    }

                });

            } catch (e) {
                console.log("Picking failed: " + e);
            }

            event.preventDefault();

        });

    };

    private switchLayout(): void {

        this.currentPage = this.currentPage == 0 ? 1 : 0;

        switch (this.currentPage) {

            case this.PAGE_SETTINGS:
                this.setingsPage.setAttribute("style", "display: block");
                this.speedoPage.setAttribute("style", "display: none");
                this.restoreLogLocationPath();
                this.settingsButton.setAttribute("style", "background: url(\"/images/speedometer.png\") no-repeat center;width: " + this.handleScreenResize())

                break;
            case this.PAGE_SPEEDO:
                this.setingsPage.setAttribute("style", "display: none");
                this.speedoPage.setAttribute("style", "display: block");

                this.settingsButton.setAttribute("style", "background: url(\"/images/settings.png\") no-repeat center; width: " + this.handleScreenResize())

                break;

        }

    };

    private restoreLogLocationPath(): void {

        this.logLocationDesc.innerHTML = SettingsManager.getManager().getSetting("path", "Not Specified");

    }

    private handleScreenResize(): string {

        let buttons = document.getElementsByClassName("dynsize");
        let ret = null;

        for (var i = 0; i < buttons.length; i++) {
            let style = window.getComputedStyle(buttons[i]);
            buttons[i].setAttribute("style", "width: " + style.height);
            ret = style.height;
        }

        return ret;

    }

    
    public statusBarShowMobileGuarded(): void {

        if (Windows.Foundation.Metadata.ApiInformation.isTypePresent("Windows.UI.ViewManagement.StatusBar")) {

            let statusbar = Windows.UI.ViewManagement.StatusBar.getForCurrentView();
            statusbar.showAsync();

        }

    }

    public addMaxAverageClickListener(callback: (event) => void): void {
        this.averageDisplay.addEventListener("click", (eventTriggered) => {
            callback(eventTriggered);
        });
    }

    public setMaxAverageText(text: string): void {
        this.averageDisplay.innerHTML = text;
    }

    public setMaxAverageDescriptionText(text: string): void {
        this.averageDesc.innerHTML = text;
    }

    public addOdometerLongClickListener(callback: () => void): void {

        this.odometerDisplay.addEventListener("touchstart", () => {
            this.odometerClearTimer = setTimeout(() => callback(), 1000);
        });

        this.odometerDisplay.addEventListener("touchend", () => clearTimeout(this.odometerClearTimer));

    }

    public addOdometerClickListener(callback: () => void): void {
        this.odometerDisplay.addEventListener("click", () => callback());
    }

    public setOdometerText(text: string): void {
        this.odometerDisplay.innerHTML = text;
    }

    public setOdometerDescription(text: string): void {
        this.odometerDescription.innerHTML = text;
    }

    public setSpeedometerText(text: string): void {
        this.speedDisplay.innerHTML = text;
    }

    public addTimeClickListener(callback: () => void): void {
        this.timeDisplay.addEventListener("click", () => callback());
    }

    public addTimeLongClickListener(callback: () => void): void {

        this.timeDisplay.addEventListener("touchend", () => {
            clearTimeout(this.timeClearTimer);
        });

        this.timeDisplay.addEventListener("touchstart", () => {
            this.timeClearTimer = setTimeout(() => {
                callback();
            }, 1000);
        });

    }

    public setTimeText(text: string): void {
        this.timeDisplay.innerHTML = text;
    }

}