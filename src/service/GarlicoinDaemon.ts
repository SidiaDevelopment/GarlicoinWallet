import {remote} from "electron";
import {ChildProcess} from "child_process";
import Logger from "./Logger";
import GarlicoinApi from "./GarlicoinApi";

class GarlicoinDaemon {
    running: boolean = false;
    start(): void {
        let child = require('child_process').execFile;
        let executablePath: string = "";

        if(!remote.getGlobal('dev')) {
            executablePath = remote.getGlobal('appPath').replace('app.asar', '');
        }
        executablePath += 'garlicoind';

        this.running = true;
        let process: ChildProcess = child(executablePath, [], this.handleProcessExit);

        GarlicoinApi.fetchDaemonStatus();
    }

    handleProcessExit = (_err: string, _data: any): void => {
        this.running = false;
        Logger.log('GarlicoinDaemon got killed', _err);
    }

    isRunning(): boolean {
        return this.running;
    }
}

export default (new GarlicoinDaemon());