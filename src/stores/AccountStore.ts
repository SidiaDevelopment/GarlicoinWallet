import {observable} from "mobx";
import GarlicoinApi, {TApiResponse} from "../service/GarlicoinApi";

interface TWallet {
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

    fetchAccounts() {
        this.runningRequests.push('*');
        GarlicoinApi.getAccountList(this.receiveAccounts);
    }

    receiveAccounts = (_response: TApiResponse) => {
        this.balanceByAccount = _response.getJson();
        this.accounts = Object.keys(_response.getJson());
        this.fetchAddresses();
        this.runningRequests = this.runningRequests.filter((_val: string) => {
            return _val != '*';
        })
    }

    fetchAddresses = () => {
        this.accounts.map((_account: string) => {
            this.runningRequests.push(_account);
            GarlicoinApi.getAddressesByAccount(_account, this.fetchedAddressesByAccount(_account));
        })
    }

    fetchedAddressesByAccount = (_account: string) => {
        return (_response: TApiResponse) => {
            this.wallet[_account] = _response.getJson() as any;
            this.runningRequests = this.runningRequests.filter((_val: string) => {
                return _val != _account;
            });
        }
    };

    @observable
    isDone() {
        return this.runningRequests.length == 0 || this.wallet == null;
    }

    getAllAccounts(): TWallet{
        if (!this.isDone()) {
            return null;
        }

        return this.wallet;
    }

    @observable
    getAllAccountNames(): string[] {
        if (!this.isDone()) {
            return null;
        }

        return this.accounts;
    }
}

export default (new AccountStore());