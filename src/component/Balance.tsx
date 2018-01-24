import * as React from 'react';
import Icon from "antd/lib/icon";
import BalanceStore from "../service/BalanceStore";
import Spin from "antd/lib/spin";
import {observer} from "mobx-react";

interface TBalanceProps {
    balanceStore: BalanceStore;
}
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
        if (this.props.balanceStore.getBalance() !== -1 && !this.props.balanceStore.isFetching()) {
            return <span>{this.props.balanceStore.getBalance() + " GRLC"}</span>;
        } else {
            const spinnerIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
            return <Spin indicator={spinnerIcon} />;
        }
    }
}

export default Balance;