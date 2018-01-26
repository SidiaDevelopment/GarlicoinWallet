import GarlicoinApi, {TApiResponse} from "../service/GarlicoinApi";
import {notification} from "antd";
import {observable} from "mobx";
import Logger from "../service/Logger";

export class BalanceStore {
    @observable
    balance: number = 0;

    @observable
    fetching: boolean = true;

    constructor() {
        this.balance = 0;
    }

    @observable
    public getBalance() {
        return this.balance;
    }

    public setBalance(_value: number) {
        this.balance = _value;
    }

    public reloadBalance() {
        this.fetchWalletBalance();
    }

    /**
     * Start getBalance call
     */
    fetchWalletBalance(): void {
        this.setFetching(true);
        GarlicoinApi.getBalance(this.fetchedWalletBalance)
    }

    /**
     * Callback for getBalance call
     *
     * @param {TApiResponse} _response
     */
    fetchedWalletBalance = (_response: TApiResponse) => {
        if (_response.getError() != null) {
            Logger.log(_response.getError());
        } else {
            this.setBalance(_response.getData().toString());
            if (!_response.wasCached()) {
                notification.open({
                    message: 'New balance fetched',
                    description: _response.getData().toString(),
                    placement: "bottomRight"
                });
            }
        }
        this.setFetching(false);
    };

    @observable
    public isFetching() {
        return this.fetching;
    }

    public setFetching(_fetching: boolean) {
        this.fetching = _fetching;
    }
}

export default new BalanceStore();