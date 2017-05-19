var MaxAverageDisplay = (function () {
    function MaxAverageDisplay() {
        var _this = this;
        this.DISPLAY_MAX = 0;
        this.DISPLAY_AVG = 1;
        this.currentDisplay = 0;
        this.globalMax = 0;
        this.desc = document.getElementById("avgdesc");
        this.display = document.getElementById("avgdisp");
        this.speeds = [];
        this.display.addEventListener("click", function () {
            _this.switchDisplay();
        });
    }
    ;
    MaxAverageDisplay.prototype.switchDisplay = function () {
        this.currentDisplay = this.currentDisplay == 1 ? 0 : 1;
        this.refresh();
    };
    ;
    MaxAverageDisplay.prototype.pushSpeed = function (speed) {
        if (this.speeds.length > 100) {
            this.speeds.shift();
        }
        this.speeds.push(speed);
    };
    ;
    MaxAverageDisplay.prototype.displayAverage = function () {
        if (this.speeds.length == 0) {
            this.display.innerHTML = "---";
            return;
        }
        ;
        var total = 0;
        for (var i = 0; i < this.speeds.length; i++) {
            total += this.speeds[i];
        }
        var avg = total / this.speeds.length;
        this.display.innerHTML = (avg * 3.6).toFixed(1);
    };
    ;
    MaxAverageDisplay.prototype.displayMaximum = function () {
        if (this.speeds.length == 0) {
            this.display.innerHTML = "---";
        }
        ;
        for (var i = 0; i < this.speeds.length; i++) {
            if (this.speeds[i] > this.globalMax) {
                this.globalMax = this.speeds[i];
            }
        }
        this.display.innerHTML = (this.globalMax * 3.6).toFixed(1);
    };
    ;
    MaxAverageDisplay.prototype.refresh = function () {
        switch (this.currentDisplay) {
            case this.DISPLAY_AVG:
                this.displayAverage();
                this.desc.innerHTML = "avg | km/h";
                break;
            case this.DISPLAY_MAX:
                this.displayMaximum();
                this.desc.innerHTML = "max | km/h";
                break;
        }
        ;
    };
    ;
    MaxAverageDisplay.prototype.getStorageContainer = function () {
        var appdata = Windows.Storage.ApplicationData.current;
        var settings = appdata.localSettings;
        var container = null;
        if (!settings.containers.hasKey("maxData")) {
            container = settings.createContainer("maxData", Windows.Storage.ApplicationDataCreateDisposition.always);
        }
        else {
            container = settings.containers.lookup("maxData");
        }
        return container;
    };
    MaxAverageDisplay.prototype.backupMax = function () {
        var container = this.getStorageContainer();
        container.values["max"] = this.globalMax;
        this.refresh();
    };
    ;
    MaxAverageDisplay.prototype.restoreMax = function () {
        var container = this.getStorageContainer();
        if (container.values["max"] == undefined || container.values["max"] == null) {
            container.values["max"] = 0;
        }
        ;
        this.globalMax = container.values["max"];
        this.refresh();
    };
    ;
    return MaxAverageDisplay;
}());
;
//# sourceMappingURL=MaxAverageDisplay.js.map