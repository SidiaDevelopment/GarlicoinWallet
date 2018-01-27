import * as React from "react";

import GarlicoinApi, {TTransaction, TApiResponse, TTransactionData} from '../service/GarlicoinApi';
import Icon from "antd/lib/icon";
import Row from 'antd/lib/grid/row';
import Col from "antd/lib/grid/col";
import Divider from "antd/lib/divider";
import Table from "antd/lib/table/Table";
import TransactionModalContent from "./TransactionModalContent";
import Modal from "antd/lib/modal/Modal";
import Button from "antd/lib/button/button";
import Balance from "./Balance";
import BalanceStore from "../stores/BalanceStore";
import message from 'antd/lib/message'
import {clipboard} from 'electron'
import StringHelper from "../service/StringHelper";
import {FormattedMessage} from 'react-intl';

interface TWalletProps {}
interface TWalletState {
    transactions: TTransaction[];
    transactionModalDataSet: TTransaction;
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
            transactionModalDataSet: null
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
        return this.getTransactionTable(this.state.transactions.length <= 0);
    }

    getTransactionTable(loading: boolean = false): JSX.Element {
        const columns = [
            {
                title: <FormattedMessage id="transactions.amount"
                                         defaultMessage="Amount"
                                         description="Amount" />,
                dataIndex: 'amount',
                key: 'amount',
            },
            {
                title: 'TXID',
                dataIndex: 'txid',
                key: 'txid',
                render: (_text: string, _record: TTransaction): JSX.Element => {
                    return <span>
                        { _text }&nbsp;
                        <a onClick={() => {
                            clipboard.writeText(_text);
                            message.success(StringHelper.copiedString);
                        }}><Icon style={{fontSize: 14}} type="paper-clip" /></a>
                    </span>;
                }
            },
            {
                title: <FormattedMessage id="transactions.options"
                                         defaultMessage="Options"
                                         description="Transactions options" />,
                key: 'option',
                render: (_text: string, _record: TTransaction): JSX.Element => {
                    return <div>
                        <Button type="primary" onClick={(e: any) => this.openTransactionModal(_record)}><Icon type="eye" /></Button>
                    </div>;
                }
            }
        ];
        return <div>
            <Table dataSource={this.state.transactions}
                   rowClassName={(record: TTransaction) => record.amount > 0 ? 'positive' : 'negative'}
                   expandIconAsCell={false}
                   columns={columns}
                   size="middle"
                   pagination={{pageSize: 7}}
                   loading={loading}
            />
            <Modal visible={this.state.transactionModalDataSet !== null}
                   onCancel={this.handleModalClose}
                   footer={null}
                   className="transactionmodal"
                   width={800}>
                <TransactionModalContent data={this.state.transactionModalDataSet} verifiedAfter={1000} />
            </Modal>
        </div>;
    }

    handleModalClose = () => {
        this.setState({transactionModalDataSet: null})
    }
    openTransactionModal = (_record: TTransaction) => {
        this.setState({transactionModalDataSet: _record})
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