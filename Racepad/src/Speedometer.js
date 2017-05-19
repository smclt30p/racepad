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
    return Speedometer;
}());
//# sourceMappingURL=Speedometer.js.map