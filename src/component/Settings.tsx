import * as React from 'react';
import Select from "antd/lib/select";
import SettingsStore from "../stores/SettingsStore";
const Option = Select.Option;

interface TSettingsProps {}
interface TSettingsState {}

class Settings extends React.Component<TSettingsProps, TSettingsState> {
    render() {
        return <Select
                value={SettingsStore.getLanguage()}
                size="large"
                onChange={this.handleLanguageChange}
            >
                <Option value="en">English</Option>
                <Option value="de">Deutsch</Option>
            </Select>;
    }

    handleLanguageChange(_key: string) {
        SettingsStore.setLanguage(_key);
    }
}

export default Settings;