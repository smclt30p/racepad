class MaxAverageDisplay {


	private speeds: number[];

	private DISPLAY_MAX = 0;
	private DISPLAY_AVG = 1;

	private currentDisplay: number = 0;
    private globalMax: number = 0;

    private ifmanager: InterfaceManager = InterfaceManager.getInterfaceManager();

	public constructor() {


		this.speeds = [];

        this.ifmanager.addMaxAverageClickListener(() => {
			this.switchDisplay();
		});

	};

	private switchDisplay(): void {

		this.currentDisplay = this.currentDisplay == 1 ? 0 : 1;
		this.refresh();

	};

	public pushSpeed(speed: number): void {

		if (this.speeds.length > 100) {
			this.speeds.shift();
		}

		this.speeds.push(speed);

	};

	private displayAverage(): void {

		if (this.speeds.length == 0) {
            this.ifmanager.setMaxAverageText("---");
			return;
		};

		let total = 0;
		for (let i = 0; i < this.speeds.length; i++) {
			total += this.speeds[i];
		}

		let avg = total / this.speeds.length;

        this.ifmanager.setMaxAverageText((avg * 3.6).toFixed(1));

	};

	private displayMaximum(): void {

		if (this.speeds.length == 0) {
            this.ifmanager.setMaxAverageText("---");
            return;
		};

		for (let i = 0; i < this.speeds.length; i++) {

			if (this.speeds[i] > this.globalMax) {
				this.globalMax = this.speeds[i];
			}

		}

        this.ifmanager.setMaxAverageText((this.globalMax * 3.6).toFixed(1));

	}; 

	public refresh(): void {

		switch (this.currentDisplay) {

			case this.DISPLAY_AVG:
                this.displayAverage();
                this.ifmanager.setMaxAverageDescriptionText("avg | km/h");
				break;
			case this.DISPLAY_MAX:
				this.displayMaximum();
                this.ifmanager.setMaxAverageDescriptionText("max | km/h");
				break;

		};

	};

	public backupMax(): void {
        SettingsManager.getManager().putSetting("max", this.globalMax.toString());
		this.refresh();
	};

	public restoreMax(): void {
        this.globalMax = parseFloat(SettingsManager.getManager().getSetting("max", "0"));
		this.refresh();
	};

};