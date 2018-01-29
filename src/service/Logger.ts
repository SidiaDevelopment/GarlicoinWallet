import {remote} from "electron";

class Logger {
    public static LOGLEVEL_DEBUG = 1;
    public static LOGLEVEL_WARNING = 2;
    public static LOGLEVEL_ERROR = 3;

    public static id = 1;

    public static log(_level: number, ...args: any[]) {
        if(remote.getGlobal('dev') || _level > Logger.LOGLEVEL_DEBUG) {
            console.log(Logger.id++, _level, ...args);
        }
    }
}

export default Logger;