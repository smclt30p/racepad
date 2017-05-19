var Speedometer = (function () {
    function Speedometer() {
        var _this = this;
        this.odometer = 0;
        this.trip1 = 0;
        this.trip2 = 0;
        this.DISPLAY_ODO = 0;
        this.DISPLAY_TRIP1 = 1;
        this.DISPLAY_TRIP2 = 2;
        this.currentDisplay = 0;
        this.maxavg = new MaxAverageDisplay();
        this.display = document.getElementById("speed");
        this.odo = document.getElementById("odometer");
        this.odoDesc = document.getElementById("odometer-desc");
        this.odo.addEventListener("click", function () {
            _this.switchDisplayMode();
        });
        this.odo.addEventListener("touchstart", function () {
            _this.clearOdoTimer = setTimeout(function () {
                _this.clearOdo();
            }, 1000);
        });
        this.odo.addEventListener("touchend", function () {
            clearTimeout(_this.clearOdoTimer);
        });
        this.displayOdodmeterData();
    }
    ;
    Speedometer.prototype.clearOdo = function () {
        switch (this.currentDisplay) {
            case this.DISPLAY_TRIP1:
                this.trip1 = 0;
                this.displayOdodmeterData();
                break;
            case this.DISPLAY_TRIP2:
                this.trip2 = 0;
                this.displayOdodmeterData();
        }
    };
    ;
    Speedometer.prototype.switchDisplayMode = function () {
        this.currentDisplay++;
        if (this.currentDisplay == 3)
            this.currentDisplay = 0;
        switch (this.currentDisplay) {
            case this.DISPLAY_ODO:
                this.odoDesc.innerHTML = "odo | km";
                this.displayOdodmeterData();
                break;
            case this.DISPLAY_TRIP1:
                this.odoDesc.innerHTML = "trip 1 | km";
                this.displayOdodmeterData();
                break;
            case this.DISPLAY_TRIP2:
                this.odoDesc.innerHTML = "trip 2 | km";
                this.displayOdodmeterData();
                break;
        }
    };
    ;
    Speedometer.prototype.displayOdodmeterData = function () {
        switch (this.currentDisplay) {
            case this.DISPLAY_ODO:
                this.odo.innerHTML = (this.odometer / 1000).toFixed(2);
                break;
            case this.DISPLAY_TRIP1:
                this.odo.innerHTML = (this.trip1 / 1000).toFixed(2);
                break;
            case this.DISPLAY_TRIP2:
                this.odo.innerHTML = (this.trip2 / 1000).toFixed(2);
                break;
        }
    };
    Speedometer.prototype.start = function () {
        var _this = this;
        Windows.Devices.Geolocation.Geolocator.requestAccessAsync()
            .then(function (value) {
            if (value != Windows.Devices.Geolocation.GeolocationAccessStatus.allowed) {
                _this.display.innerHTML = "ERR";
                return;
            }
            _this.geolocator = new Windows.Devices.Geolocation.Geolocator();
            _this.geolocator.desiredAccuracy = 1;
            _this.geolocator.reportInterval = 500;
            _this.geolocator.onstatuschanged = function (value) {
                if (value.status == Windows.Devices.Geolocation.PositionStatus.ready) {
                    _this.display.innerHTML = "0.0";
                }
            };
            _this.geolocator.onpositionchanged = function (details) {
                if (details.position.coordinate.speed.toString() == "NaN")
                    return;
                var speed = (details.position.coordinate.speed * 3.6).toFixed(1);
                _this.odometer += details.position.coordinate.speed;
                _this.trip1 += details.position.coordinate.speed;
                _this.trip2 += details.position.coordinate.speed;
                _this.maxavg.pushSpeed(details.position.coordinate.speed);
                _this.display.innerHTML = speed;
                _this.displayOdodmeterData();
                _this.maxavg.refresh();
            };
        });
    };
    ;
    Speedometer.prototype.restoreOdo = function () {
        this.maxavg.restoreMax();
        var container = this.getStorageContainer();
        if (container.values["data"] == undefined || container.values["data"] == null) {
            container.values["data"] = this.backupOdo();
        }
        var backup = JSON.parse(container.values["data"]);
        this.odometer = backup.odo;
        this.trip1 = backup.trip1;
        this.trip2 = backup.trip2;
        this.displayOdodmeterData();
    };
    ;
    Speedometer.prototype.backupOdo = function () {
        this.maxavg.backupMax();
        var backup = { "odo": null, "trip1": null, "trip2": null };
        backup.odo = this.odometer;
        backup.trip1 = this.trip1;
        backup.trip2 = this.trip2;
        var store = JSON.stringify(backup);
        var container = this.getStorageContainer();
        container.values["data"] = store;
    };
    ;
    Speedometer.prototype.getStorageContainer = function () {
        var appdata = Windows.Storage.ApplicationData.current;
        var settings = appdata.localSettings;
        var container = null;
        if (!settings.containers.hasKey("odoData")) {
            container = settings.createContainer("odoData", Windows.Storage.ApplicationDataCreateDisposition.always);
        }
        else {
            container = settings.containers.lookup("odoData");
        }
        return container;
    };
    return Speedometer;
}());
//# sourceMappingURL=Speedometer.js.map