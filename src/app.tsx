import * as React from "react";
import * as ReactDOM from "react-dom";
import './style/app.scss';
import { addLocaleData } from 'react-intl';

import * as de from 'react-intl/locale-data/de';
import * as en from 'react-intl/locale-data/en';


addLocaleData([...en, ...de]);


import Wrapper from "./component/Wrapper";
import GarlicoinDaemon from "./service/GarlicoinDaemon";
GarlicoinDaemon.start();

ReactDOM.render(
    <Wrapper />,
    document.getElementById("wrapper")
)