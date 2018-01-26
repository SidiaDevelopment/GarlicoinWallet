import * as React from 'react';
import Icon from "antd/lib/icon";
import BalanceStore from "../stores/BalanceStore";
import Spin from "antd/lib/spin";
import {observer} from "mobx-react";

interface TBalanceProps {}
interface TBalanceState {
}
@observer
class Balance extends React.Component<TBalanceProps, TBalanceState> {

    /**
     * Format current balance
     *
     * @returns {string}
     */
    render(): JSX.Element {
        if (BalanceStore.getBalance() !== -1 && !BalanceStore.isFetching()) {
            return <span>{BalanceStore.getBalance() + " GRLC"}</span>;
        } else {
            const spinnerIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
            return <Spin indicator={spinnerIcon} />;
        }
    }
}

export default Balance;