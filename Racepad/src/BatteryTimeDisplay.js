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
//# sourceMappingURL=BatteryTimeDisplay.js.map