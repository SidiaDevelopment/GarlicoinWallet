import * as React from "react";
import { Layout, Icon } from 'antd';

import {observer} from "mobx-react";
import {default as GarlicoinApi, TBlockChainInfo} from "../service/GarlicoinApi";
import Progress from "antd/lib/progress/progress";
import SettingsStore from "../stores/SettingsStore";
import {BrowserWindow, remote} from "electron";
import {FormattedMessage} from 'react-intl';

const { Content, Header } = Layout;



interface TLoadingScreenProps {}
interface TLoadingScreenState {}


@observer
class LoadingScreen extends React.Component<TLoadingScreenProps, TLoadingScreenState> {

    close() {
        let window: BrowserWindow = remote.getCurrentWindow();
        window.close();
    }

    minimize() {
        let window: BrowserWindow = remote.getCurrentWindow();
        window.minimize();
    }

    render() {
        let blockChainInfo: TBlockChainInfo = GarlicoinApi.getDaemonFetchingStatus();
        return <Layout className="layout__loadingScreen">
            <Header className="layout__header" style={{ borderBottom: '1px solid #e8e8e8', background: '#fff', padding: 0 }}>
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
            <Content>
               <img src={"client/img/logo-full-black.png"} />

               <div>
                   {
                       GarlicoinApi.getDaemonStatus() == 'fetching' ?
                           <Progress type="circle" percent={blockChainInfo.headers != 0 ?
                                Math.round((blockChainInfo.blocks / blockChainInfo.headers) * 100) :
                                0
                           } /> :
                           <Icon type="loading" className="loadingSpinner" spin />
                   }
               </div>
               <div className="connectInfo">
                   {
                       GarlicoinApi.getDaemonStatus() == 'fetching' ?
                           <FormattedMessage id="loading_screen.blockchain_status"
                                             defaultMessage="Updating Blockchain: {blocks}/{headers}"
                                             values={{
                                                 blocks: blockChainInfo.blocks,
                                                 headers: blockChainInfo.headers
                                             }}
                                             description="Blockchain" /> :
                           <FormattedMessage id="loading_screen.connecting"
                                             defaultMessage="Connecting..."
                                             description="Connecting" />
                   }
               </div>
            </Content>
        </Layout>;
    }
}

export default LoadingScreen;