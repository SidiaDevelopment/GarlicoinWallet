import {observable} from "mobx";

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

    setLanguage(_lang: string) {
        this.settings.lang = _lang;
    }

    @observable
    getLanguage(): string {
        return this.settings.lang;
    }

    setContent(_content: string) {
        this.settings.content = _content;
    }

    @observable
    getContent(): string {
        return this.settings.content;
    }

    switchCollapse() {
        this.settings.collapsed = !this.settings.collapsed;
    }

    @observable
    getCollapsed(): boolean {
        return this.settings.collapsed;
    }
}

export default (new SettingsStore());