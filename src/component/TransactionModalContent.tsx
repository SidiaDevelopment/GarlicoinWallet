import * as React from "react";
import {TTransaction} from "../service/GarlicoinApi";
import Row from "antd/lib/grid/row";
import Col from "antd/lib/grid/col";
import Badge from "antd/lib/badge";
import { Steps, Icon } from 'antd';
import Divider from "antd/lib/divider";
import List from "antd/lib/list";
const Step = Steps.Step;

interface TTransactionModalContentProps {
    data: TTransaction;
    verifiedAfter: number;
}

interface TTransactionModalContentState {
}

interface TTransactionDetailListItem {
    title: string;
    description: string | JSX.Element;
    icon: string
}

class TransactionModalContent extends React.Component<TTransactionModalContentProps, TTransactionModalContentState>{
    render(): JSX.Element {
        if (this.props.data === null) {
            return null;
        }
        let dataSource: TTransactionDetailListItem[] = [
            {
                title: 'Receiver',
                description: this.props.data.address,
                icon: 'user'
            },
            {
                title: 'Amount',
                description: this.props.data.amount.toString() + " Garlicoins",
                icon: 'area-chart'
            },
            {
                title: 'Type',
                description: this.props.data.category === "receive" ? 'Received' : 'Sent',
                icon: 'swap'
            },
            {
                title: 'Confirmations',
                description: this.getConfirmationStatus(this.props.data.confirmations),
                icon: 'check'
            },
            {
                title: 'Blockhash',
                description: this.props.data.blockhash,
                icon: 'link'
            },
            {
                title: 'Time',
                description: this.props.data.timereceived.toString(),
                icon: 'clock-circle-o'
            }
        ];
        return (
            <div>
                <Divider>Transaction</Divider>
                <Steps>
                    <Step status="finish" title="Send" icon={<Icon type="logout" />} />
                    <Step
                        status={this.props.data.confirmations >= this.props.verifiedAfter && 'finish' || 'process'}
                        title="Verification"
                        icon={this.props.data.confirmations >= this.props.verifiedAfter && <Icon type="solution" /> || <Icon type="loading" />}
                    />
                    <Step
                        status={this.props.data.confirmations >= this.props.verifiedAfter && 'finish' || 'wait'}
                        title="Received" icon={<Icon type="login" />}
                    />
                </Steps>
                <Divider/>

                <List className="detaillist" dataSource={dataSource} renderItem={
                    (item: TTransactionDetailListItem) => {
                        return <List.Item>
                            <List.Item.Meta
                                avatar={<Icon type={item.icon}/>}
                                title={item.title}
                                description={item.description}
                            />
                        </List.Item>
                    }
                }/>
            </div>
        );
    }

    getConfirmationStatus(_confirmations: number): JSX.Element {
        return <Badge status={this.evaluateCurrentStatus(_confirmations)} text={_confirmations.toString()} />
    }

    evaluateCurrentStatus(_confirmations: number): 'success' | 'processing' | 'default' | 'error' | 'warning' {
        return _confirmations >= this.props.verifiedAfter ? "success" : "warning";
    }
}

export default TransactionModalContent;