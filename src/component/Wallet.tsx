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
import Balance from "./Balance";
import BalanceStore from "../service/BalanceStore";
const Step = Steps.Step;

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
    balanceStore: BalanceStore;

    constructor(props: TWalletProps) {
        super(props);
        this.state = {
            transactions: [],
            transactionModalDataSet: null
        }

        this.balanceStore = new BalanceStore();
    }

    /**
     * Enable asnyc api calls state changes
     */
    componentDidMount() {
        this.mounted = true;
        this.balanceStore.reloadBalance();
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
                <Divider>Garlicoin Balance</Divider>
                <Row className="balance">
                    <Col span={24}><Balance balanceStore={this.balanceStore} /></Col>
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

    fetchTransactions() {
        let api = GarlicoinApi.getInstance();
        api.getTransactions(100, this.fetchedTransactions)
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
        this.setState({transactions});
    };


}

export default Wallet;