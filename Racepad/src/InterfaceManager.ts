class InterfaceManager {

    private PAGE_SPEEDO = 0;
    private PAGE_SETTINGS = 1;

    private currentPage: number = 0;

    private loggerButton = document.getElementById("record-btn");
    private settingsButton = document.getElementById("settings-btn");

    private loggerDesc = document.getElementById("record-desc");

    private setingsPage = document.getElementById("settings-wrap");
    private speedoPage = document.getElementById("speed-wrap");

    private pathpicker = document.getElementById("path-pick");

    private logLocation = document.getElementById("log-loc");

    public setupToolbar(): void {
        window.onresize = this.handleResize;
        this.handleResize();
        this.attachListeners();
    };

    private attachListeners(): void {

        this.settingsButton.addEventListener("click", () => {
            this.switchLayout();
        });

        this.pathpicker.addEventListener("click", (event) => {

            var folderPicker = new Windows.Storage.Pickers.FolderPicker();
            folderPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;
            folderPicker.fileTypeFilter.append("*");

            try {

                folderPicker.pickSingleFolderAsync().then((folder: Windows.Storage.StorageFolder) => {

                    if (folder != null) {
                        console.log(folder);
                        this.logLocation.innerHTML = folder.path;
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

                this.settingsButton.setAttribute("style", "background: url(\"/images/speedometer.png\") no-repeat center;width: " + this.handleResize())

                break;
            case this.PAGE_SPEEDO:
                this.setingsPage.setAttribute("style", "display: none");
                this.speedoPage.setAttribute("style", "display: block");

                this.settingsButton.setAttribute("style", "background: url(\"/images/settings.png\") no-repeat center; width: " + this.handleResize())

                break;

        }

    };

    private handleResize(): string {

        let buttons = document.getElementsByClassName("dynsize");
        let ret = null;

        for (var i = 0; i < buttons.length; i++) {
            let style = window.getComputedStyle(buttons[i]);
            buttons[i].setAttribute("style", "width: " + style.height);
            ret = style.height;
        }

        return ret;

    }

}