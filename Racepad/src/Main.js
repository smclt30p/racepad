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
//# sourceMappingURL=Main.js.map