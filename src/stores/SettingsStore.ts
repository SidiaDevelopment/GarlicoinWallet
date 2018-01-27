import {observable} from "mobx";
import {localeData} from "../component/Wrapper";
import * as fs from 'fs';
import * as path from "path";
import * as electron from "electron";

interface TSettings {
    lang: string;
    content: string;
    collapsed: boolean;
}
class SettingsStore {
    @observable
    settings: TSettings = {
        lang: 'en',
        content: 'wallet',
        collapsed: false
    }

    constructor() {
        const userDataPath = (electron.app || electron.remote.app).getPath('userData');
        let settingsFile = path.join(userDataPath, 'settings.json');

        let defaults = {
            content: 'wallet'
        };

        this.settings = Object.assign({}, JSON.parse(fs.readFileSync(settingsFile) as any), defaults);

    }

    setLanguage(_lang: string) {
        this.settings.lang = _lang;
        this.persist();
    }

    @observable
    getLanguage(): string {
        return this.settings.lang;
    }

    setContent(_content: string) {
        this.settings.content = _content;
        this.persist();
    }

    @observable
    getContent(): string {
        return this.settings.content;
    }

    switchCollapse() {
        this.settings.collapsed = !this.settings.collapsed;
        this.persist();

    }

    @observable
    getCollapsed(): boolean {
        return this.settings.collapsed;
    }

    persist() {
        const userDataPath = (electron.app || electron.remote.app).getPath('userData');
        let settingsFile = path.join(userDataPath, 'settings.json');

        fs.writeFileSync(settingsFile, JSON.stringify(this.settings))
    }
}

export default (new SettingsStore());