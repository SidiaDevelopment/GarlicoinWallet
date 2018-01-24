import GarlicoinApi, {TApiResponse} from "./GarlicoinApi";
import {notification} from "antd";
import {observable} from "mobx";

class BalanceStore {
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
        let api = GarlicoinApi.getInstance();
        api.getBalance(this.fetchedWalletBalance)

        this.fetching = true;
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
            this.setBalance(response.getData().toString());
            if (!response.wasCached()) {
                notification.open({
                    message: 'New balance fetched',
                    description: response.getData().toString(),
                    placement: "bottomRight"
                });
            }
        }
        this.fetching = false;
    };

    @observable
    public isFetching() {
        return this.fetching;
    }
}

export default BalanceStore;