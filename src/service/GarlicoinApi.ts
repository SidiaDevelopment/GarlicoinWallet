import { remote } from 'electron';

class GarlicoinApi {
    call(_parameters: ReadonlyArray<string>, _callback: (_err: string, _data: any) => void) {
        let child = require('child_process').execFile;
        let executablePath = "garlicoin-cli.exe";

        let parameters = [];
        if (remote.getGlobal('dev')) {
            parameters.push('-testnet');
        }

        parameters = parameters.concat(_parameters);

        child(executablePath, parameters, _callback);
    }

    public getBalance(_callback: (_err: string, _data: any) => void) {
        this.call(["getbalance"], _callback)
    }
}

export default GarlicoinApi;