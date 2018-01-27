import * as React from 'react';
import {Icon} from 'antd';
import {FormattedMessage} from 'react-intl';

interface TSiderCopyrightProps {}
interface TSiderCopyrightState {}

class SiderCopyright extends React.Component<TSiderCopyrightProps, TSiderCopyrightState> {
    render() {
        return <div className="copyright">
            <FormattedMessage id="copyright.developed_by"
                              defaultMessage="Developed by"
                              description="Developed by" /> <a href="https://github.com/SidiaDevelopment/" target="_blank">Sidia </a><br />
            <a href="https://github.com/SidiaDevelopment/GarlicoinWallet" target="_blank"><Icon type="github" /></a>&nbsp;|&nbsp;
            <a href="https://gitlab.sidia.net/Sidia/GarliWallet" target="_blank"><Icon type="gitlab" /></a>
        </div>
    }
}

export default SiderCopyright;