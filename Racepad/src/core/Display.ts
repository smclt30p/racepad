class Display {

    private displayHandler: Windows.System.Display.DisplayRequest;
    private requestsMade: number = 0;

    public constructor() {
        this.displayHandler = new Windows.System.Display.DisplayRequest();
    }

    public requestAwake(): void {
        this.requestsMade++;
        this.displayHandler.requestActive();
    }

    public releaseRequest(): void {
        this.requestsMade--;
        if (this.requestsMade < 0) {
            this.requestsMade = 0;
            return;
        }
        this.displayHandler.requestRelease();
    }

}