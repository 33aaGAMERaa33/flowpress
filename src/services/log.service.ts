import "chalk";
import chalk from "chalk";

export class LogService {
    private constructor(){

    }

    static log(log: any) {
        console.log(`${chalk.blueBright("[LOG]")} ${log}`);
    }

    static error(error: any) {
        console.log(`${chalk.redBright("[ERROR]")} ${error}`);
    }
}