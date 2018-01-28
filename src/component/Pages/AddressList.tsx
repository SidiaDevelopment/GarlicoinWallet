import * as React from 'react';
import AccountStore from "../../stores/AccountStore";
import { FormattedMessage } from 'react-intl';
import { observer } from "mobx-react";
import StringHelper from "../../service/StringHelper";
import { clipboard } from "electron";
import { Modal, Button, Spin, List, Collapse, Icon, Divider, message } from 'antd';
import GarlicoinApi, {TApiResponse} from "../../service/GarlicoinApi";

const confirm = Modal.confirm;

interface TAddressListProps {}
interface TAddressListState {}

const Panel = Collapse.Panel;

/**
 * class AddressList
 *
 * Displays all addresses and provides the possibility to create new addresses by account
 */
@observer
class AddressList extends React.Component<TAddressListProps, TAddressListState> {
    componentDidMount() {
        AccountStore.fetchAccounts(true);
    }

    constructor(_props: TAddressListProps) {
        super(_props);

        this.state = {
            addFor: ""
        }
    }

    /**
     * Render address list
     *
     * @returns {any}
     */
    render() {
        const spinnerIcon = <Icon type="loading" style={{ fontSize: 30 }} spin />;
        return <div id="adressList">
            <Divider><FormattedMessage id="addresses.all_adresses" defaultMessage="All addresses" /></Divider>
            {
                AccountStore.isDone() ?
                <Collapse accordion>
                    { Object.keys(AccountStore.getAllAccounts()).map((_key: string, _index: number) => {
                        let title = _key == "" ? 'Default' : _key;
                        return <Panel header={title} key={ _index.toString()}>
                            <List
                                size="small"
                                dataSource={AccountStore.getAllAccounts()[_key]}
                                renderItem={(item: string) => (<List.Item>{item}&nbsp;{this.copyIcon(item)}</List.Item>)}
                            />
                            <Button type="primary" onClick={this.add(_key)}>
                                <Icon type="plus" /> <FormattedMessage id='addresses.add_button' defaultMessage='Add address' />
                            </Button>
                        </Panel>
                    })}
                </Collapse> :
                <div className="loading">
                    <Spin indicator={spinnerIcon} />
                </div>
            }
        </div>
    }

    /**
     * Add new address to key
     *
     * @param {string} _key
     * @returns {() => void}
     */
    add = (_key: string) => {
        let me = this;
        return () => {
            confirm({
                title: StringHelper.wrapIntl(<FormattedMessage id='addresses.confirm_create' defaultMessage='Confirm' />),
                content: StringHelper.wrapIntl(<FormattedMessage id='addresses.confirm_create.message' defaultMessage='Create new address?' />),
                onOk() {
                    GarlicoinApi.getNewAddress(_key, me.newAddressSuccess)
                }
            });
        }
    }

    /**
     * New address got created
     *
     * @param {TApiResponse} _response
     */
    newAddressSuccess = (_response: TApiResponse) => {
        if (_response.getError()) {
            Modal.error({
                title: StringHelper.wrapIntl(<FormattedMessage id='addresses.create_failure' defaultMessage='Failure creating new address' />),
                content: _response.getError(),
            });
        } else {
            AccountStore.fetchAccounts(false);
            Modal.success({
                title: StringHelper.wrapIntl(<FormattedMessage id='addresses.create_success' defaultMessage='Success creating new address' />),
                content: _response.getData(),
            });
        }
    }

    /**
     * Add a copy icon
     *
     * @param {string} _description
     * @returns {any}
     */
    copyIcon(_description: string) {
        return <a onClick={() => {
            clipboard.writeText(_description as string);
            message.success(StringHelper.copiedString);
        }}>
            <Icon style={{fontSize: 14}} type="paper-clip" />
        </a>
    }
}

export default AddressList;