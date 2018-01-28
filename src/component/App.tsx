import * as React from "react";
import Wallet from './Pages/Wallet';
import Settings from './Pages/Settings'
import { Layout, Menu, Icon, Form} from 'antd';
import {remote, BrowserWindow} from 'electron';
import {SelectParam} from "antd/lib/menu";
import Send from "./Pages/Send";
import DevTools from "mobx-react-devtools";
import { FormattedMessage } from 'react-intl';
import SiderCopyright from "./SiderCopyright";
import SettingsStore from "../stores/SettingsStore";
import {observer} from "mobx-react";
import AddressList from "./Pages/AddressList";
import About from "./Pages/About";

const { Header, Sider, Content } = Layout;



interface TAppProps {}
interface TAppState {}

interface TElements {
    [key: string]: () => JSX.Element
}


@observer
class App extends React.Component<TAppProps, TAppState> {
    /**
     * Switch collapse status
     */
    toggle = () => {
        SettingsStore.switchCollapse();
    }

    /**
     * Close app
     */
    close() {
        let window: BrowserWindow = remote.getCurrentWindow();
        window.close();
    }

    /**
     * Minimize app
     */
    minimize() {
        let window: BrowserWindow = remote.getCurrentWindow();
        window.minimize();
    }

    /**
     * Selecte menu point
     * @param {SelectParam} params
     */
    menuSelect = (params: SelectParam) => {
        SettingsStore.setContent(params.key);
    }

    /**
     * Get the content
     * @returns {JSX.Element}
     */
    get contentDisplay() {

        let elements: TElements = {
            wallet: () => <Wallet/>,
            send: () =>  {
                const WrappedSendForm = Form.create()(Send);
                return <WrappedSendForm/>;
            },
            settings: () => <Settings />,
            addresses: () => <AddressList />,
            about: () => <About />
        };

        if (elements.hasOwnProperty(SettingsStore.getContent())) {
            return elements[SettingsStore.getContent()]();
        } else {
            return elements.wallet();
        }
    }

    /**
     * Render
     * @returns {any}
     */
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
                    <Menu.Item key="addresses">
                        <Icon type="link"/>
                        <FormattedMessage id="navigation.address_manager"
                                          defaultMessage="Addresses"
                                          description="Addresses navigation point" />
                    </Menu.Item>
                    <Menu.Item key="settings">
                        <Icon type="setting"/>
                        <FormattedMessage id="navigation.settings"
                                          defaultMessage="Settings"
                                          description="Settings navigation point" />
                    </Menu.Item>
                    <Menu.Item key="about">
                        <Icon type="info-circle"/>
                        <FormattedMessage id="navigation.about"
                                          defaultMessage="About"
                                          description="About navigation point" />
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