import * as React from 'react';

import {observer} from "mobx-react";
import SettingsStore from "../stores/SettingsStore";


import App from './App';

import { IntlProvider } from 'react-intl';


export const localeData: any = {
    de: require('../translations/locales/de.json')
};

interface TWrapperProps {}
interface TWrapperState {}

@observer
class Wrapper extends React.Component<TWrapperProps, TWrapperState> {
        render(): JSX.Element {
        return <IntlProvider locale={SettingsStore.getLanguage()} key={SettingsStore.getLanguage()} messages={localeData[SettingsStore.getLanguage()]}>
            <App />
        </IntlProvider>;
    }
}

export default Wrapper;