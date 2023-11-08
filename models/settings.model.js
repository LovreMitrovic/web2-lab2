class Settings {
    constructor() {
        if (Settings.instance) {
            return Settings.instance;
        }
        this.xss = false;
        this.ca = false;
        Settings.instance = this;
    }
}

module.exports = new Settings();