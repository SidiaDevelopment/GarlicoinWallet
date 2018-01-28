import * as React from 'react';
import message from "antd/lib/message";
import StringHelper from "../../../service/StringHelper";
import {TTransaction} from "../../../service/GarlicoinApi";
import Table from "antd/lib/table/Table";
import Modal from "antd/lib/modal/Modal";
import TransactionModalContent from "./TransactionModalContent";
import Icon from "antd/lib/icon";
import Button from "antd/lib/button/button";
import {clipboard} from 'electron'
import {FormattedMessage} from 'react-intl';

interface TTransactionProps {
    transactions: TTransaction[];
}

interface TTransactionState {
    transactionModalDataSet: TTransaction;
}

class Transactions extends React.Component<TTransactionProps, TTransactionState> {
    constructor(props: TTransactionProps) {
        super(props);
        this.state = {
            transactionModalDataSet: null,
        }
    }

    render() {
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
            <Table dataSource={this.props.transactions}
                   rowClassName={(record: TTransaction) => record.amount > 0 ? 'positive' : 'negative'}
                   expandIconAsCell={false}
                   columns={columns}
                   size="middle"
                   pagination={{pageSize: 7}}
                   loading={this.props.transactions.length <= 0}
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

    /**
     * Close transaction modal
     */
    handleModalClose = () => {
        this.setState({transactionModalDataSet: null})
    }

    /**
     * Open transaction modal
     *
     * @param {TTransaction} _record
     */
    openTransactionModal = (_record: TTransaction) => {
        this.setState({transactionModalDataSet: _record})
    }
}

export default Transactions;