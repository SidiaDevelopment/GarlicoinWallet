import * as React from 'react';
import { FormattedMessage, IntlProvider } from 'react-intl';
import SettingsStore from "../stores/SettingsStore";
import {localeData} from '../component/Wrapper';


class StringHelper {
    public get copiedString(): JSX.Element {
        return <IntlProvider locale={SettingsStore.getLanguage()} key={SettingsStore.getLanguage()} messages={localeData[SettingsStore.getLanguage()]}>
            <FormattedMessage
            id="app.copied"
            defaultMessage="Copied to clipboard"
            description="Copied to clipboard" />
        </IntlProvider>;
    }
}

export default (new StringHelper());