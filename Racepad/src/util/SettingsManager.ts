﻿class SettingsManager {

    private static intance: SettingsManager = null;

    public static getManager(): SettingsManager {

        if (SettingsManager.intance == null) {
            SettingsManager.intance = new SettingsManager();
        }

        return SettingsManager.intance;

    }


    public getSetting(key: string, def: string): string {

        let container = this.getStorageContainer();

        if (container.values[key] == null || container.values[key] == undefined) {
            container.values[key] = def;
            return def;
        }

        return container.values[key];

    }

    public putSetting(key: string, value: string): void {
        let container = this.getStorageContainer();
        container.values[key] = value;
    }

    private getStorageContainer(): Windows.Storage.ApplicationDataContainer {

        let appdata: Windows.Storage.ApplicationData = Windows.Storage.ApplicationData.current;
        let settings: Windows.Storage.ApplicationDataContainer = appdata.localSettings;
        let container: Windows.Storage.ApplicationDataContainer = null;

        if (!settings.containers.hasKey("appdata")) {
            container = settings.createContainer("appdata", Windows.Storage.ApplicationDataCreateDisposition.always);
        } else {
            container = settings.containers.lookup("appdata");
        }

        return container;

    }

}