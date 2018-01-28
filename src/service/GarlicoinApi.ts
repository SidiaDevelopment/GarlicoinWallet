/**
 * Copyright 2018
 * @author: Sidia
 * @discord: Sidia#9322
 *
 * Garlicoin to the moon!
 */

import { remote } from 'electron';
import Logger from './Logger';
import {observable} from "mobx";
import {TSendModalData} from "../component/Pages/Send";
/**
 * Callback with unformatted input
 */
export interface TCallback {
    (_err: string, _data: any, _stderr: any): void
}

/**
 * "End-User" callback with formatted input
 */
export interface TResponseCallback {
    (response: TApiResponse): void
}

/**
 * Full cache
 */
interface TCache {
    [key: string]: TCacheEntry;
}

/**
 * Single cache entry
 */
interface TCacheEntry {
    timestamp: number;
    response: TApiResponse;
}

/**
 * Formatted api response
 */
export interface TApiResponse {
    data: any;
    err: any;
    cached: boolean;

    getData(): any;
    getError(): any;
    wasCached(): boolean;
    setCached(): void;
    getJson(): JSON;
}

/**
 * Transaction api response
 */
export interface TTransaction {
    account: string;
    address: string;
    category: string;
    amount: number;
    label: string;
    vout: number;
    confirmations: number;
    blockhash: string;
    blockindex: number;
    blocktime: number;
    txid: string;
    walletconflicts: string[];
    time: number;
    timereceived: number;
}

/**
 * Partial response from getblockchaininfo
 */
export interface TBlockChainInfo {
    blocks: number;
    headers: number;
}

/**
 * Extension for displaying in lists
 */
export interface TTransactionData extends TTransaction {
    key: number;
}

/**
 * Provides the api services through garlicoin-cli
 *
 * @methods:
 *  - getBalance
 *  - getTransactions
 *  - getBlockChainInfo
 *  - getAccountList
 *  - getAddressesByAccount
 *  - sendFrom
 *  - getNewAddress
 *  - TODO
 */
class GarlicoinApi {
    /**
     * Collection of all cache types which contain all cache entries
     *
     * @type {{}}
     */
    private cache: TCache = {};

    @observable
    private daemonStatus: 'exited' | 'starting' | 'fetching' | 'finished' = 'starting';

    @observable
    private fetchingStatus: TBlockChainInfo = {
        blocks: 0,
        headers: 0
    };

    /**
     * Make an api request via garlicoin-cli, cache is used by default
     * One result instance per request type will be saved
     *
     * @param {string} _command
     * @param {ReadonlyArray<string>} _parameters
     * @param {TCallback} _callback
     * @param {number} _cacheTime
     */
    call(_command: string, _parameters: ReadonlyArray<any>, _callback: TResponseCallback, _cacheTime: number = 0) {
        Logger.log("Sent api call:", _command, _parameters);
        // Init garlicoin-cli
        let child = require('child_process').execFile;
        let executablePath: string = "";

        if(!remote.getGlobal('dev')) {
            executablePath = remote.getGlobal('appPath').replace('app.asar', '');
        }
        executablePath += "garlicoin-cli";

        // Initialise command parameters
        let parameters: Array<string> = [];
        parameters.push(_command);
        parameters = parameters.concat(_parameters);

        // Prepare callback
        if(_cacheTime !== 0) {
            // Check Cache
            let lastCacheEntry: TCacheEntry | boolean;
            if ((lastCacheEntry = this.cacheGet(_command, _cacheTime)) !== false) {
                // Cache exists, use cache
                let response: TApiResponse = (<TCacheEntry>lastCacheEntry).response;

                Logger.log("Api call (cached):", _command, response);

                _callback(response);
                return;
            }
        }

        let encapsulatedCacheCallback: TCallback;
        encapsulatedCacheCallback = this.encapsulatedCacheCallback(_command, _callback);

        // Fetch
        child(executablePath, parameters, {windowsVerbatimArguments: true}, encapsulatedCacheCallback);
    }

    /**
     * Prepares the response with some functions
     *
     * @param {string} _err
     * @param _data
     * @param {boolean} _cached
     * @returns {TApiResponse}
     */
    prepareResponse(_err: string, _data: any, _cached: boolean = false): TApiResponse {
        return {
            data: _data,
            err: _err,
            cached: _cached,

            getData(): any {
                return this.data;
            },

            getError(): string {
                return this.err;
            },

            wasCached(): boolean {
                return this.cached
            },

            setCached(): void {
                this.cached = true;
            },

            getJson(): JSON {
                return JSON.parse(this.getData().toString())
            }
        };
    }

    /* Requests */

    /**
     * Fetch the current Garlicoin balance
     *
     * @param {TCallback} _callback
     */
    public getBalance(_callback: TResponseCallback) {
        this.call("getbalance", [], _callback, 10);
    }

    /**
     * Fetch all transactions
     *
     * @param {number} _count
     * @param {TResponseCallback} _callback
     */
    public getTransactions(_count: number, _callback: TResponseCallback) {
        this.call("listtransactions", ['*', _count], _callback, 60);
    }

    /**
     * Get current blockchain informations
     *
     * @param {TResponseCallback} _callback
     */
    public getBlockChainInfo(_callback: TResponseCallback) {
        this.call("getblockchaininfo", [], _callback, 0);
    }

    /***
     * Get all accounts in wallet
     *
     * @param {TResponseCallback} _callback
     */
    public getAccountList(_callback: TResponseCallback) {
        this.call("listaccounts", [], _callback, 0);
    }

    /**
     * Get all addresses by account
     *
     * @param {string} _account
     * @param {TResponseCallback} _callback
     */
    public getAddressesByAccount(_account: string, _callback: TResponseCallback) {
        let account = _account == "" ? '""' : _account;
        this.call("getaddressesbyaccount", [account], _callback, 0);
    }

    /**
     * Send coins from address to receiver
     *
     * @param {TSendModalData} _options
     * @param {TResponseCallback} _callback
     */
    public sendFrom(_options: TSendModalData, _callback: TResponseCallback) {
        let account = _options.from.length == 0 ? '""' : _options.from;
        let params = [account, _options.receiver, _options.amount]
        if(_options.comment) {
            params.push(1);
            params.push('"' + _options.comment + '"');
        }
        if(_options.comment2) {
            params.push('"' + _options.comment2 + '"');
        }
        this.call(
            'sendfrom',
            params,
            _callback,
            0
        )
    }

    /**
     * Get new address for account
     *
     * @param {string} _account
     * @param {TResponseCallback} _callback
     */
    public getNewAddress(_account: string, _callback: TResponseCallback) {
        let account = _account.length == 0 ? '""' : _account;
        this.call('getnewaddress', [account], _callback, 0);
    }

    /* Cache logic */

    /**
     * !!COMPLICATED!!
     * Encapsulates the original callback to save the cache before the callback gets executed
     * @param {string} _command
     * @param {TCallback} _originalCallback
     * @returns {TCallback}
     */
    encapsulatedCacheCallback(_command: string, _originalCallback: TResponseCallback): TCallback {
        return (_err: string, _data: any, _stderr: any): void => {
            let response: TApiResponse = this.prepareResponse(_err, _data);

            Logger.log("Api call:", _command, response);

            _originalCallback(response);
            response.setCached();
            this.cacheSave(_command, response);
        }
    }

    /**
     * Saves the current request to cache
     *
     * @param {string} _command
     * @param _response
     */
    cacheSave(_command: string, _response: TApiResponse): void {
        if (_response.getError() != null) {
            return;
        }

        let timestamp = new Date().getTime() / 1000;
        this.cache[_command] = {
            timestamp: timestamp,
            response: _response
        };
    }

    /**
     * Get the most current entry from cache by command type
     *
     * @param {string} _command
     * @param {number} _cacheTime
     * @returns {TCacheEntry | boolean}
     */
    cacheGet(_command: string, _cacheTime: number): TCacheEntry | boolean{
        if (this.cache.hasOwnProperty(_command)) {
            let timestamp = new Date().getTime() / 1000;
            if (this.cache[_command].timestamp > timestamp - _cacheTime) {
                return this.cache[_command];
            }
        }
        return false;
    }

    /* Daemon logic */

    /**
     * Set in which status the daemon is right now
     * @param {"exited" | "starting" | "fetching" | "finished"} _status
     */
    setDaemonStatus(_status: 'exited' | 'starting' | 'fetching' | 'finished') {
        this.daemonStatus = _status;
    }

    /**
     * Get daemon status
     */
    fetchDaemonStatus = () => {
        this.getBlockChainInfo(this.fetchedDaemonStatus);
    }

    /**
     * Callback for daemon status
     * @param {TApiResponse} _response
     */
    fetchedDaemonStatus = (_response: TApiResponse) => {
        let error: string = "";
        if(_response.getError()) {
            error = _response.getError().message;
        }
        if (error && error.indexOf('error code: -28') !== -1) {
            // Starting up daemon
            this.setDaemonStatus('starting');
            this.fetchDaemonStatus();
        } else if (error && error.indexOf('couldn\'t connect to server') !== -1) {
            // Daemon not started at all
            this.setDaemonStatus('exited');
            this.fetchDaemonStatus();
        } else if (error) {
            // Unknown error
            Logger.log('Got error from GarlicoinApi', _response.getError());
        } else {
            // Check if daemon is fetching or ready
            let graceBlockDiff = 50;
            let blockChain: TBlockChainInfo = _response.getJson() as any;
            if(blockChain.blocks + graceBlockDiff < blockChain.headers || blockChain.headers == 0) {
                this.setDaemonStatus('fetching');
                this.fetchingStatus = blockChain;
                this.fetchDaemonStatus();
            } else {
                this.setDaemonStatus('finished');
            }
        }
    }

    /**
     * Returns the daemon status
     * @returns {"exited" | "starting" | "fetching" | "finished"}
     */
    @observable
    getDaemonStatus(): 'exited' | 'starting' | 'fetching' | 'finished' {
        return this.daemonStatus;
    }

    /**
     * Gets how much blocks the daemon has fetched
     * @returns {TBlockChainInfo}
     */
    getDaemonFetchingStatus(): TBlockChainInfo {
        return this.fetchingStatus;
    }

}

export default (new GarlicoinApi());