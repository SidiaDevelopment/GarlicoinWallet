import * as React from "react";
import Divider from "antd/lib/divider";
import {FormattedMessage} from 'react-intl';
import Form from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import Input from "antd/lib/input/Input";

import {FormComponentProps} from "antd/lib/form";
import AccountStore from "../stores/AccountStore";
import Select from "antd/lib/select";
import {observer} from "mobx-react";
import Button from "antd/lib/button/button";
import {Icon, notification} from 'antd';
import Modal from "antd/lib/modal/Modal";
import SendModalContent from "./SendModalContent";
import GarlicoinApi, {TApiResponse} from "../service/GarlicoinApi";
import StringHelper from "../service/StringHelper";

const Option = Select.Option;
export interface TSendModalData {
    receiver: string;
    from: string;
    amount: number;
    comment: string;
    comment2: string;
}
interface TSendState {
    sendModalDataset: TSendModalData;
}

@observer
class Send extends React.Component<FormComponentProps, TSendState> {
    constructor(props: FormComponentProps) {
        super(props);

        this.state = {
            sendModalDataset: null
        }
    }

    componentDidMount() {
        AccountStore.fetchAccounts();
    }

    handleSubmit = (e: any) => {
        e.preventDefault();
        this.props.form.validateFields((err, values: TSendModalData) => {
            if (!err) {
                if (this.checkValues(values)) {
                    this.setState({sendModalDataset: values})
                }
                console.log('Received values of form: ', values);
            }
        });
    }

    checkValues(values: TSendModalData): boolean {
        if (values.receiver == undefined || values.receiver.length != 34 || values.receiver[0] != 'G') {
            notification['error']({
                message: StringHelper.wrapIntl(<FormattedMessage id="send.error" defaultMessage="Error in transaction" />),
                description: StringHelper.wrapIntl(<FormattedMessage id="send.error.receiver" defaultMessage="Wrong receiver entered" />),
                placement: "bottomRight"
            });
            return false;
        }
        if (values.amount == undefined) {
            notification['error']({
                message: StringHelper.wrapIntl(<FormattedMessage id="send.error" defaultMessage="Error in transaction" />),
                description: StringHelper.wrapIntl(<FormattedMessage id="send.error.amount" defaultMessage="Wrong amount entered" />),
                placement: "bottomRight"
            });
            return false;
        }
        return true;
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;

        return <div>
            <Divider>Send coins</Divider>
            <Form onSubmit={this.handleSubmit}>
                <FormItem label={<FormattedMessage id="send.address" defaultMessage="Receiver" />}>
                    {getFieldDecorator('receiver', {})(
                        <Input placeholder='Garlicoin address'/>
                    )}
                </FormItem>
                <FormItem label={<FormattedMessage id="send.from_address" defaultMessage="From address" />}>
                    {AccountStore.getAllAccountNames() ?
                        getFieldDecorator('from', {
                            initialValue: ''
                        })(
                            <Select
                                size={'default'} >
                                {AccountStore.getAllAccountNames().map((value: string) => {
                                    let valueLabel = value == '' ? 'Default' : value;
                                    return <Option key="valueLabel" value={value}>{valueLabel}</Option>;
                                })}
                            </Select>
                        ) : <Icon type='loading' spin />
                    }
                </FormItem>
                <FormItem label={<FormattedMessage id="send.amount" defaultMessage="Amount" />}>
                    {getFieldDecorator('amount', {})(
                        <Input placeholder='0.001' />
                    )}
                </FormItem>
                <FormItem label={<FormattedMessage id="send.comment" defaultMessage="Comment" />}>
                    {getFieldDecorator('comment', {})(
                        <Input />
                    )}
                </FormItem>
                <FormItem label={<FormattedMessage id="send.comment2" defaultMessage="Additional Comment" />}>
                    {getFieldDecorator('comment2', {})(
                        <Input />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit"><FormattedMessage id="send.submit" defaultMessage="Send" /></Button>
                </FormItem>
            </Form>
            <Modal visible={this.state.sendModalDataset !== null}
                   onCancel={this.handleModalClose}
                   onOk={this.sendTransaction}
                   className="transactionmodal"
                   width={800}>
                <SendModalContent data={this.state.sendModalDataset} />
            </Modal>
        </div>
    }

    handleModalClose = () => {
        this.setState({sendModalDataset: null})
    }

    sendTransaction = () => {
        GarlicoinApi.sendFrom(this.state.sendModalDataset, this.transactionSuccessful);
    }

    transactionSuccessful = (_response: TApiResponse) => {
        notification['success']({
            message: StringHelper.wrapIntl(<FormattedMessage id="send.success" defaultMessage="Transaction successful" />),
            description: "",
            placement: "bottomRight",
            style: {width: 500}
        });
        this.setState({sendModalDataset: null});
    }
}

export default Send;