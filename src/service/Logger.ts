import {remote} from "electron";

class Logger {
    public static log(...args: any[]) {
        if(!remote.getGlobal('dev')) {
            console.log(...args);
        }
    }
}

export default Logger;