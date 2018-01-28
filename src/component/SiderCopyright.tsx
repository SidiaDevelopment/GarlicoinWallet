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
            <a href="https://github.com/SidiaDevelopment/GarlicoinWallet" target="_blank"><Icon type="github" /></a>
        </div>
    }
}

export default SiderCopyright;