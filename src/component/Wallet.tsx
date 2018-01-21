import * as React from "react";

import { notification } from 'antd';

import GarlicoinApi from './../service/GarlicoinApi';

interface TWalletProps {}
interface TWalletState {
    balance: number;
}

class Wallet extends React.Component<TWalletProps, TWalletState> {
    private mounted = false;

    constructor(props: TWalletProps) {
        super(props);
        this.state = {
            balance: -1,
        }
    }

    componentDidMount() {
        this.mounted = true;
        this.fetchWalletBalance();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        return (
            <div>
                Your wallet contains { this.getWalletBalance() }
            </div>
        );
    }

    fetchWalletBalance() {
        let api = new GarlicoinApi();
        api.getBalance(this.fetchedWalletBalance)
    }

    fetchedWalletBalance = (_err: string, _data: any) => {
        if (_err != null) {
            console.log(_err);
        } else {
            if (this.mounted) {
                this.setState({balance: _data.toString()});
            }
            notification.open({
                message: 'New balance fetched',
                description: _data.toString(),
            });
        }
    };

    getWalletBalance() {
        if (this.state.balance !== -1) {
            return this.state.balance + " Garlicoins";
        } else {
            return "[loading...]"
        }
    }
}

export default Wallet;