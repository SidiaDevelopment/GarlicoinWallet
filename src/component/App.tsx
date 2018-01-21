import * as React from "react";
import Wallet from './Wallet';
import { Layout, Menu, Icon } from 'antd';
import { remote, BrowserWindow } from 'electron';
import {SelectParam} from "antd/lib/menu";
import Send from "./Send";

const { Header, Sider, Content } = Layout;

interface TSidiaProps {}
interface TSidiaState {
    collapsed: boolean;
    content: string;
}


class App extends React.Component<TSidiaProps, TSidiaState> {
    constructor(props: TSidiaProps) {
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
        let element = <Wallet />;

        switch(this.state.content) {
            case "wallet":
                element = <Wallet />;
                break;
            case "send":
                element = <Send />
        }
        return element;
    }

    render() {
        return <Layout className="layout__wrapper">
            <Sider
                trigger={null}
                collapsible
                collapsed={this.state.collapsed}
                className="layout__navbar"
            >
                <div className="logo"/>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onSelect={this.menuSelect}>
                    <Menu.Item key="wallet">
                        <Icon type="user"/>
                        <span>nav 1</span>
                    </Menu.Item>
                    <Menu.Item key="send">
                        <Icon type="video-camera"/>
                        <span>Wallet</span>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Icon type="upload"/>
                        <span>nav 3</span>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header className="layout__header" style={{background: '#fff', padding: 0}}>
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
                <Content style={{margin: '24px 16px', padding: 24, background: '#fff', minHeight: 488}}>
                    { this.contentDisplay }
                </Content>
            </Layout>
        </Layout>;
    }
}

export default App;