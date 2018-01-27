import * as React from "react";
import {TTransaction} from "../service/GarlicoinApi";
import {clipboard} from 'electron'
import Badge from "antd/lib/badge";
import { Steps, Icon, message } from 'antd';
import Divider from "antd/lib/divider";
import List from "antd/lib/list";
import GarlicoinDate from "../service/GarlicoinDate";
import StringHelper from "../service/StringHelper";
import {FormattedMessage} from 'react-intl';

const Step = Steps.Step;

interface TTransactionModalContentProps {
    data: TTransaction;
    verifiedAfter: number;
}

interface TTransactionModalContentState {
}

interface TTransactionDetailListItem {
    title: string | JSX.Element;
    description: string | JSX.Element;
    icon: string,
    clipboard?: boolean;
}

class TransactionModalContent extends React.Component<TTransactionModalContentProps, TTransactionModalContentState>{
    render(): JSX.Element {
        if (this.props.data === null) {
            return null;
        }
        let dataSource: TTransactionDetailListItem[] = [
            {
                title: <FormattedMessage id="transactions.address"
                                         defaultMessage="Address" />,
                description: this.props.data.address,
                icon: 'user',
                clipboard: true
            },
            {
                title: <FormattedMessage id="transactions.amount"
                                         defaultMessage="Amount" />,
                description: this.props.data.amount.toString(),
                icon: 'area-chart',
                clipboard: true
            },
            {
                title: <FormattedMessage id="transactions.type"
                                         defaultMessage="Type" />,
                description: this.props.data.category === "receive" ?
                    <FormattedMessage id="transactions.received"
                                      defaultMessage="Received" /> :
                    <FormattedMessage id="transactions.sent"
                                      defaultMessage="Sent" />,
                icon: 'swap'
            },
            {
                title: <FormattedMessage id="transactions.confirmations"
                                         defaultMessage="Confirmations" />,
                description: this.getConfirmationStatus(this.props.data.confirmations),
                icon: 'check'
            },
            {
                title: 'Blockhash',
                description: this.props.data.blockhash,
                icon: 'link',
                clipboard: true
            },
            {
                title: <FormattedMessage id="transactions.time"
                                         defaultMessage="Zeitpunkt" />,
                description: GarlicoinDate.formattedDate(this.props.data.timereceived),
                icon: 'clock-circle-o'
            }
        ];
        return (
            <div>
                <Divider>Transaction</Divider>
                <Steps>
                    <Step status="finish"
                          title={<FormattedMessage id="transactions.header.send"
                                                   defaultMessage="Send" />}
                          icon={<Icon type="logout" />} />
                    <Step
                        status={this.props.data.confirmations >= this.props.verifiedAfter && 'finish' || 'process'}
                        title={<FormattedMessage id="transactions.header.verification"
                                                 defaultMessage="Verification" />}
                        icon={this.props.data.confirmations >= this.props.verifiedAfter && <Icon type="solution" /> || <Icon type="loading" />}
                    />
                    <Step
                        status={this.props.data.confirmations >= this.props.verifiedAfter && 'finish' || 'wait'}
                        title={<FormattedMessage id="transactions.header.received"
                                                 defaultMessage="Received" />}
                        icon={<Icon type="login" />}
                    />
                </Steps>
                <Divider/>

                <List className="detaillist" dataSource={dataSource} renderItem={
                    (item: TTransactionDetailListItem) => {
                        return <List.Item>
                            <List.Item.Meta
                                avatar={<Icon type={item.icon}/>}
                                title={item.title}
                                description={this.concatItemDescription(item.description, item.clipboard)}
                            />
                        </List.Item>
                    }
                }/>
            </div>
        );
    }

    concatItemDescription(_description: JSX.Element | string, _clipboard: boolean) {
        return <span>
            {_description}&nbsp;
            {_clipboard && <a onClick={() => {
                clipboard.writeText(_description as string);
                message.success(StringHelper.copiedString);
            }}><Icon style={{fontSize: 14}} type="paper-clip" /></a>}
        </span>;
    }

    getConfirmationStatus(_confirmations: number): JSX.Element {
        return <Badge status={this.evaluateCurrentStatus(_confirmations)} text={_confirmations.toString()} />
    }

    evaluateCurrentStatus(_confirmations: number): 'success' | 'processing' | 'default' | 'error' | 'warning' {
        return _confirmations >= this.props.verifiedAfter ? "success" : "warning";
    }
}

export default TransactionModalContent;