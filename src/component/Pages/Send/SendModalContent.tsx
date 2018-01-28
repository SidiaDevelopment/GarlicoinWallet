import * as React from "react";
import {clipboard} from 'electron'
import { Steps, Icon, message } from 'antd';
import Divider from "antd/lib/divider";
import List from "antd/lib/list";
import StringHelper from "../../../service/StringHelper";
import {FormattedMessage} from 'react-intl';
import {TSendModalData} from "../Send";
import SettingsStore from "../../../stores/SettingsStore";
import { IntlProvider } from 'react-intl';

const Step = Steps.Step;

interface TSendModalContentProps {
    data: TSendModalData;
}

interface TTransactionModalContentState {
}

interface TTransactionDetailListItem {
    title: string | JSX.Element;
    description: string | JSX.Element;
    icon: string,
    clipboard?: boolean;
}

class SendModalContent extends React.Component<TSendModalContentProps, TTransactionModalContentState>{
    render(): JSX.Element {
        if (this.props.data === null) {
            return null;
        }
        let dataSource: TTransactionDetailListItem[] = [
            {
                title: <FormattedMessage id="send.receiver"
                                         defaultMessage="Address" />,
                description: this.props.data.receiver,
                icon: 'user',
                clipboard: true
            },
            {
                title: <FormattedMessage id="send.amount"
                                         defaultMessage="Amount" />,
                description: this.props.data.amount.toString(),
                icon: 'area-chart',
                clipboard: true
            },
            {
                title: <FormattedMessage id="send.modal.type"
                                         defaultMessage="Type" />,
                description: <FormattedMessage id="transactions.sent"
                                      defaultMessage="Send" />,
                icon: 'swap'
            }
        ];
        if(this.props.data.comment) {
            dataSource.push(
                {
                    title: <FormattedMessage id="send.comment"
                                             defaultMessage="Comment" />,
                    description: this.props.data.comment,
                    icon: 'message',
                    clipboard: true
                }
            );
        }
        if(this.props.data.comment2) {
            dataSource.push(
                {
                    title: <FormattedMessage id="send.comment2"
                                             defaultMessage="Additional comment" />,
                    description: this.props.data.comment2,
                    icon: 'message',
                    clipboard: true
                },
            );
        }
        return (
            <div>
                <Divider>Transaction</Divider>
                <Steps>
                    <Step status="wait"
                          title={<FormattedMessage id="transactions.header.send"
                                                   defaultMessage="Send" />}
                          icon={<Icon type="logout" />} />
                    <Step
                        status="wait"
                        title={<FormattedMessage id="transactions.header.verification"
                                                 defaultMessage="Verification" />}
                        icon={<Icon type="solution" />}
                    />
                    <Step
                        status="wait"
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
}

export default SendModalContent;