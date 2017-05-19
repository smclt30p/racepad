var Main = (function () {
    function Main() {
        this.stopwatch = new Stopwatch(document.getElementById("time"));
        this.speedometer = new Speedometer(document.getElementById("speed"));
        this.stopwatch.start();
        this.speedometer.start();
    }
    Main.prototype.main = function () {
        Windows.UI.WebUI.WebUIApplication.addEventListener("enteredbackground", function () {
            console.log("SUSPENDING");
        });
    };
    return Main;
}());
;
window.onload = function () { new Main().main(); };
var Speedometer = (function () {
    function Speedometer(display) {
        this.display = display;
    }
    ;
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
                var speed = (details.position.coordinate.speed * 3.6).toFixed(1);
                if (speed == "NaN")
                    return;
                _this.display.innerHTML = speed;
            };
        });
    };
    ;
    Speedometer.prototype.stop = function () {
    };
    ;
    return Speedometer;
}());
var Stopwatch = (function () {
    function Stopwatch(element) {
        var _this = this;
        this.tearDownWatch();
        this.display = element;
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
