import * as http from 'http';
import {TCallback} from "./GarlicoinApi";

export interface TRpcConnectionDetails {
    port: number;
    host: string;
    user: string;
    pass: string;
}
class RpcClient {
    call(_method: string, _params: string[], _callback: TCallback) {
        let id = 1;

        let connectionDetails: TRpcConnectionDetails = {
            port: 42068,
            host: 'localhost',
            user: 'test',
            pass: 'test'
        }

        let requestJSON = JSON.stringify({
            'id'     : id,
            'method' : _method,
            'params' : _params,
            'jsonrpc': '2.0'
        });

        let headers: http.OutgoingHttpHeaders = {};

        if (connectionDetails.user && connectionDetails.pass) {
            let buff = new Buffer(connectionDetails.user + ':' + connectionDetails.pass).toString('base64');
            headers['Authorization'] = 'Basic ' + buff;
        }
        headers['Host'] = connectionDetails.host;
        headers['Content-Length'] = Buffer.byteLength(requestJSON, 'utf8');

        let options = {
            hostname: connectionDetails.host,
            port    : connectionDetails.port,
            path    : '/',
            method  : 'POST',
            headers : headers
        };

        let request: http.ClientRequest = http.request(options);
        request.write(requestJSON);

        request.on('error', (_error: any) => {
            _callback(_error, "");
        });

        request.on('response', (_response: http.IncomingMessage) => {
            let data = '';

            _response.on('data', function responseData(chunk){
                data += chunk;
            });

            _response.on('end', function responseEnd(){
                let decodedResponse: any = JSON.parse(data);
                _callback(decodedResponse.error, decodedResponse.result)
            });
        })
    }
}

export default (new RpcClient());