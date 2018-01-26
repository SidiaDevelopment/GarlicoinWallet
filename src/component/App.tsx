import * as React from "react";
import Wallet from './Wallet';
import Settings from './Settings'
import { Layout, Menu, Icon } from 'antd';
import { remote, BrowserWindow } from 'electron';
import {SelectParam} from "antd/lib/menu";
import Send from "./Send";
import DevTools from "mobx-react-devtools";
import { FormattedMessage } from 'react-intl';
import SiderCopyright from "./SiderCopyright";
import SettingsStore from "../stores/SettingsStore";
import {observer} from "mobx-react";

const { Header, Sider, Content } = Layout;



interface TAppProps {}
interface TAppState {}

interface TElements {
    [key: string]: () => JSX.Element
}


@observer
class App extends React.Component<TAppProps, TAppState> {
    constructor(props: TAppProps) {
        super(props);
        this.state = {
            collapsed: false,
        };
    }

    toggle = () => {
        SettingsStore.switchCollapse();
    }

    close() {
        let window: BrowserWindow = remote.getCurrentWindow();
        window.close();
    }

    minimize() {
        let window: BrowserWindow = remote.getCurrentWindow();
        window.minimize();
    }

    menuSelect = (params: SelectParam) => {
        SettingsStore.setContent(params.key);
    }

    get contentDisplay() {
        let elements: TElements = {
            wallet: () => <Wallet/>,
            send: () => <Send/>,
            settings: () => <Settings />
        };

        if (elements.hasOwnProperty(SettingsStore.getContent())) {
            return elements[SettingsStore.getContent()]();
        } else {
            return elements.wallet();
        }
    }

    render() {
        return <Layout className="layout__wrapper">
            <Sider
                trigger={null}
                collapsible
                collapsed={SettingsStore.getCollapsed()}
                className="layout__navbar"
            >
                <div className="logo">
                    <img src={SettingsStore.getCollapsed() ? "client/img/logo-small.png" : "client/img/logo-full.png"}
                         onClick={() => this.setState({content: 'wallet'})} />
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={[SettingsStore.getContent()]} onSelect={this.menuSelect}>
                    <Menu.Item key="wallet">
                        <Icon type="wallet"/>
                        <FormattedMessage id="navigation.wallet"
                                          defaultMessage="Wallet"
                                          description="Wallet navigation point" />
                    </Menu.Item>
                    <Menu.Item key="send">
                        <Icon type="logout"/>
                        <FormattedMessage id="navigation.send_coins"
                                          defaultMessage="Send Coins"
                                          description="Send Coins navigation point" />
                    </Menu.Item>
                    <Menu.Item key="settings">
                        <Icon type="setting"/>
                        <FormattedMessage id="navigation.settings"
                                          defaultMessage="Settings"
                                          description="Settings navigation point" />
                    </Menu.Item>
                </Menu>
                <SiderCopyright />
            </Sider>
            <Layout>
                <Header className="layout__header" style={{ borderBottom: '1px solid #e8e8e8', background: '#fff', padding: 0 }}>
                    <Icon
                        className="trigger"
                        type={SettingsStore.getCollapsed() ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.toggle}
                    />
                    <Icon
                        className="close"
                        type="close"
                        onClick={this.close}
                    />
                    <Icon
                        className="minimize"
                        type="minus"
                        onClick={this.minimize}
                    />
                </Header>
                <Content style={{padding: '12px 40px', background: '#fff'}}>
                    { this.contentDisplay }
                </Content>
            </Layout>
            {
                remote.getGlobal('dev') && <DevTools />
            }
        </Layout>;
    }
}

export default App;