import * as React from "react";

import { notification } from 'antd';

import GarlicoinApi from '../service/GarlicoinApi';
import {TApiResponse} from "../service/GarlicoinApi";

interface TWalletProps {}
interface TWalletState {
    balance: number;
}

/**
 * Main wallet
 * - Shows Balance
 */
class Wallet extends React.Component<TWalletProps, TWalletState> {
    private mounted = false;

    constructor(props: TWalletProps) {
        super(props);
        this.state = {
            balance: -1,
        }
    }

    /**
     * Enable asnyc api calls state changes
     */
    componentDidMount() {
        this.mounted = true;
        this.fetchWalletBalance();
    }

    /**
     * Prevent this.state after unmounting from async api calls
     */
    componentWillUnmount() {
        this.mounted = false;
    }

    /**
     * Rendering
     *
     * @returns {any}
     */
    render(): JSX.Element {
        return (
            <div>
                Your wallet contains { this.getWalletBalance() }
            </div>
        );
    }

    /**
     * Start getBalance call
     */
    fetchWalletBalance(): void {
        let api = GarlicoinApi.getInstance();
        api.getBalance(this.fetchedWalletBalance)
    }

    /**
     * Callback for getBalance call
     *
     * @param {TApiResponse} response
     */
    fetchedWalletBalance = (response: TApiResponse) => {
        if (response.getError() != null) {
            console.log(response.getError());
        } else {
            if (this.mounted) {
                this.setState({balance: response.getData().toString()});
            }
            if (!response.wasCached()) {
                notification.open({
                    message: 'New balance fetched',
                    description: response.getData().toString(),
                    placement: "bottomRight"
                });
            }
        }
    };

    /**
     * Format current balance
     *
     * @returns {string}
     */
    getWalletBalance(): string {
        if (this.state.balance !== -1) {
            return this.state.balance + " Garlicoins";
        } else {
            return "[loading...]"
        }
    }
}

export default Wallet;