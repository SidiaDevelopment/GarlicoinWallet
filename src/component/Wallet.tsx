import * as React from "react";

import { notification } from 'antd';

import GarlicoinApi, {TTransaction, TApiResponse, TTransactionData} from '../service/GarlicoinApi';
import Spin from "antd/lib/spin";
import Icon from "antd/lib/icon";
import Row from 'antd/lib/grid/row';
import Col from "antd/lib/grid/col";
import Divider from "antd/lib/divider";
import Table from "antd/lib/table/Table";
import Steps from "antd/lib/steps";
import TransactionModalContent from "./TransactionModalContent";
import Modal from "antd/lib/modal/Modal";
import Button from "antd/lib/button/button";
const Step = Steps.Step;

interface TWalletProps {}
interface TWalletState {
    balance: number;
    transactions: TTransaction[];
    transactionModalDataSet: TTransaction;
}

/**
 * Main wallet
 * - Shows Balance
 */
class Wallet extends React.Component<TWalletProps, TWalletState> {
    private mounted = false;

    constructor(props: TWalletProps) {
        super(props);
        this.state = {
            balance: -1,
            transactions: [],
            transactionModalDataSet: null
        }
    }

    /**
     * Enable asnyc api calls state changes
     */
    componentDidMount() {
        this.mounted = true;
        this.fetchWalletBalance();
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
                <Divider>Garlicoin Balance</Divider>
                <Row className="balance">
                    <Col span={24}>{ this.getWalletBalance() }</Col>
                </Row>
                <Divider>Transactions</Divider>
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
                title: 'Amount',
                dataIndex: 'amount',
                key: 'amount',
            },
            {
                title: 'TXID',
                dataIndex: 'txid',
                key: 'txid',
            },
            {
                title: 'Options',
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

    /**
     * Start getBalance call
     */
    fetchWalletBalance(): void {
        let api = GarlicoinApi.getInstance();
        api.getBalance(this.fetchedWalletBalance)
    }

    /**
     * Callback for getBalance call
     *
     * @param {TApiResponse} response
     */
    fetchedWalletBalance = (response: TApiResponse) => {
        if (response.getError() != null) {
            console.log(response.getError());
        } else {
            if (this.mounted) {
                this.setState({balance: response.getData().toString()});
            }
            if (!response.wasCached()) {
                notification.open({
                    message: 'New balance fetched',
                    description: response.getData().toString(),
                    placement: "bottomRight"
                });
            }
        }
        this.fetchTransactions();
    };

    fetchTransactions() {
        let api = GarlicoinApi.getInstance();
        api.getTransactions(100, this.fetchedTransactions)
    }

    fetchedTransactions = (response: TApiResponse) => {
        let transactions: TTransactionData[] = [];
        let transactionsJson: any[] = [];

        transactionsJson = transactionsJson.concat(response.getJson());
        transactionsJson.map((_transaction: any, _index: number) => {
            transactions.push({
                key: _index,
                account: _transaction.account,
                address: _transaction.address,
                category: _transaction.category,
                amount: _transaction.amount,
                label: _transaction.label,
                vout: _transaction.vout,
                confirmations: _transaction.confirmations,
                blockhash: _transaction.blockhash,
                blockindex: _transaction.blockindex,
                blocktime: _transaction.blocktime,
                txid: _transaction.txid,
                walletconflicts: _transaction.walletconflicts,
                time: _transaction.time,
                timereceived: _transaction.timereceived,
            });
        });
        transactions = transactions.reverse();
        this.setState({transactions});
    };

    /**
     * Format current balance
     *
     * @returns {string}
     */
    getWalletBalance(): string | JSX.Element {
        if (this.state.balance !== -1) {
            return this.state.balance + " GRLC";
        } else {
            const spinnerIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
            return <Spin indicator={spinnerIcon} />
        }
    }
}

export default Wallet;