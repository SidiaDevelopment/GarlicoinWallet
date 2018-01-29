import {observable} from "mobx";
import GarlicoinApi, {TApiResponse} from "../service/GarlicoinApi";

export interface TWallet {
    [name: string]: string[];
}

class AccountStore {
    @observable
    accounts: string[] = [];

    @observable
    wallet: TWallet = {};

    @observable
    runningRequests: string[] = [];

    @observable
    balanceByAccount: Object = {};

    /**
     * Get all accounts
     *
     * @param {boolean} useCached
     */
    fetchAccounts(useCached: boolean) {
        if (useCached && this.accounts.length) {
            return;
        }
        this.wallet = {};
        this.runningRequests.push('*');
        GarlicoinApi.getAccountList(this.receiveAccounts);
    }

    /**
     * Get all accounts callback
     *
     * @param {TApiResponse} _response
     */
    receiveAccounts = (_response: TApiResponse) => {
        this.balanceByAccount = _response.getData();
        this.accounts = Object.keys(_response.getData());
        this.fetchAddresses();
        this.runningRequests = this.runningRequests.filter((_val: string) => {
            return _val != '*';
        })
    }

    /**
     * Get all addresses by accounts
     */
    fetchAddresses = () => {
        this.accounts.map((_account: string) => {
            this.runningRequests.push(_account);
            this.wallet[_account] = [];
            GarlicoinApi.getAddressesByAccount(_account, this.fetchedAddressesByAccount(_account));
        })
    }

    /**
     * Get all addresses by account callback
     *
     * @param {string} _account
     * @returns {(_response: TApiResponse) => void}
     */
    fetchedAddressesByAccount = (_account: string) => {
        return (_response: TApiResponse) => {
            this.wallet[_account] = _response.getData();
            this.runningRequests = this.runningRequests.filter((_val: string) => {
                return _val != _account;
            });
        }
    };

    /**
     * Returns if fetching is done
     *
     * @returns {boolean | number}
     */
    @observable
    isDone() {
        return (this.runningRequests.length == 0 && this.accounts.length);
    }

    /**
     * Returns all accounts
     *
     * @returns {TWallet}
     */
    @observable
    getAllAccounts(): TWallet {
        if (!this.isDone()) {
            return null;
        }

        return this.wallet;
    }

    /**
     * Return a list of all account names
     * @returns {string[]}
     */
    @observable
    getAllAccountNames(): string[] {
        if (!this.isDone()) {
            return null;
        }

        return this.accounts;
    }
}

export default (new AccountStore());