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
//# sourceMappingURL=Main.js.map