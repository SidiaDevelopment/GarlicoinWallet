import * as React from 'react';
import {Icon} from 'antd';

interface TSiderCopyrightProps {}
interface TSiderCopyrightState {}

class SiderCopyright extends React.Component<TSiderCopyrightProps, TSiderCopyrightState> {
    render() {
        return <div className="copyright">
            Developed by <a href="https://github.com/SidiaDevelopment/" target="_blank">Sidia </a><br />
            <a href="https://gitlab.sidia.net/Sidia/GarliWallet" target="_blank"><Icon type="gitlab" /></a>
        </div>
    }
}

export default SiderCopyright;