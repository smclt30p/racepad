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
//# sourceMappingURL=Stopwatch.js.map