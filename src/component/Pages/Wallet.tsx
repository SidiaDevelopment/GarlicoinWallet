import * as React from "react";

import GarlicoinApi, {TTransaction, TApiResponse, TTransactionData} from '../../service/GarlicoinApi';
import Row from 'antd/lib/grid/row';
import Col from "antd/lib/grid/col";
import Divider from "antd/lib/divider";
import Balance from "./Wallet/Balance";
import BalanceStore from "../../stores/BalanceStore";
import {FormattedMessage} from 'react-intl';
import Transactions from "./Wallet/Transactions";

interface TWalletProps {}
interface TWalletState {
    transactions: TTransaction[];
}

/**
 * Main wallet
 * - Shows Balance
 */
class Wallet extends React.Component<TWalletProps, TWalletState> {
    private mounted: boolean = false;

    constructor(props: TWalletProps) {
        super(props);
        this.state = {
            transactions: [],
        }
    }

    /**
     * Enable asnyc api calls state changes
     */
    componentDidMount() {
        this.mounted = true;
        BalanceStore.reloadBalance();
        this.fetchTransactions();
    }

    /**
     * Prevent this.state after unmounting from async api calls
     */
    componentWillUnmount() {
        this.mounted = false;
    }

    /**
     * Rendering
     *
     * @returns {any}
     */
    render(): JSX.Element {
        return (
            <div id="wallet">
                <Divider><FormattedMessage id="wallet.divider_balance"
                                           defaultMessage="Garlicoin Balance"
                                           description="Balance divider" /></Divider>
                <Row className="balance">
                    <Col span={24}><Balance /></Col>
                </Row>
                <Divider><FormattedMessage id="wallet.divider_transactions"
                                           defaultMessage="Transactions"
                                           description="Transactions divider" /></Divider>
                <Row className="transactions">
                    { this.getTransactionList() }
                </Row>
            </div>

        );
    }

    getTransactionList(): JSX.Element {
        return <Transactions transactions={this.state.transactions}/>
    }

    fetchTransactions() {
        GarlicoinApi.getTransactions(100, this.fetchedTransactions)
    }

    fetchedTransactions = (response: TApiResponse) => {
        let transactions: TTransactionData[] = [];
        let key = 1;
        transactions = transactions.concat(response.getJson() as any);
        transactions = transactions.map((_value: TTransactionData) => {
            _value.key = key++;
            return _value;
        });
        transactions = transactions.reverse();
        if(this.mounted) {
            this.setState({transactions});
        }
    };


}

export default Wallet;