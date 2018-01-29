import {remote} from "electron";
import {ChildProcess} from "child_process";
import Logger from "./Logger";
import GarlicoinApi from "./GarlicoinApi";

class GarlicoinDaemon {
    running: boolean = false;
    start(): void {
        let child = require('child_process').execFile;
        let globalPath: string = "";

        if(!remote.getGlobal('dev')) {
            globalPath = remote.getGlobal('appPath').replace('app.asar', '');
        }

        this.running = true;
        let process: ChildProcess = child(globalPath + 'garlicoind', ['-conf='+globalPath+'garlicoin.conf'], this.handleProcessExit);

        GarlicoinApi.fetchDaemonStatus();
    }

    handleProcessExit = (_err: string, _data: any): void => {
        this.running = false;
        Logger.log(Logger.LOGLEVEL_WARNING, 'GarlicoinDaemon got killed', _err);
    }

    isRunning(): boolean {
        return this.running;
    }
}

export default (new GarlicoinDaemon());