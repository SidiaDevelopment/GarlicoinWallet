import * as React from "react";
import Wallet from './Wallet';
import { Layout, Menu, Icon } from 'antd';
import { remote, BrowserWindow } from 'electron';
import {SelectParam} from "antd/lib/menu";
import Send from "./Send";

const { Header, Sider, Content } = Layout;

interface TAppProps {}
interface TAppState {
    collapsed: boolean;
    content: string;
}

interface TElements {
    [key: string]: any
}


class App extends React.Component<TAppProps, TAppState> {
    constructor(props: TAppProps) {
        super(props);
        this.state = {
            collapsed: false,
            content: "wallet"
        };
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    close() {
        let window : BrowserWindow = remote.getCurrentWindow();
        window.close();
    }

    menuSelect = (params: SelectParam) => {
        this.setState({content: params.key});
    }

    get contentDisplay() {
        let elements: TElements = {
            wallet: <Wallet/>,
            send: <Send/>
        };

        if (elements.hasOwnProperty(this.state.content)) {
            return elements[this.state.content];
        } else {
            return elements.wallet;
        }
    }

    render() {
        return <Layout className="layout__wrapper">
            <Sider
                trigger={null}
                collapsible
                collapsed={this.state.collapsed}
                className="layout__navbar"
            >
                <div className="logo">
                    <img src={this.state.collapsed ? "app/img/logo-small.png" : "app/img/logo-full.png"}
                         onClick={() => this.setState({content: 'wallet'})} />
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['wallet']} onSelect={this.menuSelect}>
                    <Menu.Item key="wallet">
                        <Icon type="wallet"/>
                        <span>Wallet</span>
                    </Menu.Item>
                    <Menu.Item key="send">
                        <Icon type="logout"/>
                        <span>Send coins</span>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header className="layout__header" style={{ background: '#fff', padding: 0 }}>
                    <Icon
                        className="trigger"
                        type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.toggle}
                    />
                    <Icon
                        className="close"
                        type="close"
                        onClick={this.close}
                    />
                </Header>
                <Content style={{margin: '24px 16px', padding: 24, background: '#fff'}}>
                    { this.contentDisplay }
                </Content>
            </Layout>
        </Layout>;
    }
}

export default App;