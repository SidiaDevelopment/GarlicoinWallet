/**
 * Copyright 2018
 * @author: Sidia
 * @discord: Sidia#9322
 *
 * Garlicoin to the moon!
 */

import { remote, app } from 'electron';
/**
 * Callback with unformatted input
 */
export interface TCallback {
    (_err: string, _data: any): void
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
    err: string;
    cached: boolean;

    getData(): any;
    getError(): string;
    wasCached(): boolean;
    setCached(): void;
    getJson(): JSON;
}

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

export interface TTransactionData extends TTransaction {
    key: number;
}

/**
 * Provides the api services through garlicoin-cli
 * @methods:
 *  - getBalance
 *  - TODO
 */
class GarlicoinApi {
    /**
     * Collection of all cache types which contain all cache entries
     *
     * @type {{}}
     */
    private cache: TCache = {};

    /**
     * Holds the singleton instance for GarlicoinApi
     *
     * @type {GarlicoinApi}
     */
    private static instance: GarlicoinApi = null;

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
        // Init garlicoin-cli
        let child = require('child_process').execFile;
        let executablePath: string = "";

        if(!remote.getGlobal('dev')) {
            executablePath = "resources/";
        }
        executablePath += "garlicoin-cli.exe";

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

                response.setCached();

                _callback(response);
                return;
            }
        }

        let encapsulatedCacheCallback: TCallback;
        encapsulatedCacheCallback = this.encapsulatedCacheCallback(_command, _callback);

        // Fetch
        child(executablePath, parameters, encapsulatedCacheCallback);
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

    public getTransactions(_count: number, _callback: TResponseCallback) {
        this.call("listtransactions", ['*', _count], _callback, 60);
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
        return (_err: string, _data: any): void => {
            let response: TApiResponse = this.prepareResponse(_err, _data);

            this.cacheSave(_command, response);
            _originalCallback(response);
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

    /* Singleton logic */

    /**
     * Initialises the GarlicoinApi singleton instance if necessary
     * Then returns the instance
     *
     * @returns {GarlicoinApi}
     */
    public static getInstance(): GarlicoinApi {
        if (GarlicoinApi.instance === null) {
            GarlicoinApi.instance = new GarlicoinApi();
        }

        return GarlicoinApi.instance;
    }
}

export default GarlicoinApi;