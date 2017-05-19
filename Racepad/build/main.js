var BatteryTimeDisplay = (function () {
    function BatteryTimeDisplay() {
        this.display = document.getElementById("battime");
    }
    ;
    BatteryTimeDisplay.prototype.getBatteryPercentage = function () {
        var batteryReport = Windows.Devices.Power.Battery.aggregateBattery.getReport();
        var perc = Math.round(batteryReport.remainingCapacityInMilliwattHours / batteryReport.fullChargeCapacityInMilliwattHours * 100);
        return perc;
    };
    ;
    BatteryTimeDisplay.prototype.getTime = function () {
        var date = new Date();
        return date.getHours() + ":" + date.getMinutes();
    };
    ;
    BatteryTimeDisplay.prototype.start = function () {
        var _this = this;
        this.timer = setInterval(function () {
            _this.populate();
        }, 60000);
        this.populate();
    };
    ;
    BatteryTimeDisplay.prototype.populate = function () {
        this.display.innerHTML = this.getBatteryPercentage() + "% | " + this.getTime();
    };
    ;
    return BatteryTimeDisplay;
}());
;
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
var Main = (function () {
    function Main() {
        this.stopwatch = new Stopwatch();
        this.speedometer = new Speedometer();
        this.batterytime = new BatteryTimeDisplay();
        this.displayHandler = new Windows.System.Display.DisplayRequest();
    }
    Main.prototype.main = function () {
        var _this = this;
        Windows.UI.WebUI.WebUIApplication.addEventListener("enteredbackground", function () {
            _this.speedometer.backupOdo();
            _this.displayHandler.requestRelease();
        });
        Windows.UI.WebUI.WebUIApplication.addEventListener("leavingbackground", function () {
            _this.displayHandler.requestActive();
        });
        this.speedometer.restoreOdo();
        this.batterytime.start();
        this.speedometer.start();
    };
    return Main;
}());
;
window.onload = function () { new Main().main(); };
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
var Stopwatch = (function () {
    function Stopwatch() {
        var _this = this;
        this.tearDownWatch();
        this.display = document.getElementById("time");
        this.running = false;
        this.display.addEventListener("click", function () {
            console.log("click");
            if (_this.running) {
                _this.pause();
                return;
            }
            _this.start();
        });
        this.display.addEventListener("touchend", function () {
            console.log("mouseup");
            clearTimeout(_this.longPressTimer);
        });
        this.display.addEventListener("touchstart", function () {
            console.log("mousedown");
            _this.longPressTimer = setTimeout(function () {
                _this.reset();
            }, 1000);
        });
    }
    Stopwatch.prototype.reset = function () {
        clearInterval(this.interval);
        this.display.innerHTML = "--:--:--";
        this.tearDownWatch();
        this.running = false;
    };
    Stopwatch.prototype.pause = function () {
        clearInterval(this.interval);
        this.running = false;
    };
    Stopwatch.prototype.start = function () {
        var _this = this;
        this.interval = setInterval(function () {
            _this.seconds += 1;
            _this.dateType.setTime(_this.seconds * 1000);
            var hours = _this.formatTime(_this.dateType.getUTCHours());
            var minutes = _this.formatTime(_this.dateType.getUTCMinutes());
            var seconds = _this.formatTime(_this.dateType.getUTCSeconds());
            _this.display.innerHTML = hours + ":" + minutes + ":" + seconds;
        }, 1000);
        this.running = true;
    };
    Stopwatch.prototype.tearDownWatch = function () {
        this.seconds = 0;
        this.dateType = new Date();
        this.dateType.setTime(0);
    };
    Stopwatch.prototype.formatTime = function (raw) {
        if (raw == 0) {
            return "00";
        }
        if ((raw.toString()).length == 1) {
            return "0" + raw;
        }
        return raw.toString();
    };
    return Stopwatch;
}());
