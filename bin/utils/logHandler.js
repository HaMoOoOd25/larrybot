const color = require(`chalk`);
const log = console.log;

exports.warn = (...message) => {
    console.log(color.yellow(`<warn>`));
    console.warn(...message);
    console.log(color.yellow(`</warn>`));
};

exports.error = (...message) => {
    console.log(color.red(`<error>`));
    console.warn(...message);
    console.log(color.red(`</error>`));
};

exports.info = (...message) => {
    console.log(color.red(`[INFORMATION] > ` + color.yellow(...message)));
};

exports.chat = (...message) => {
    console.log(color.green(`[CHAT] ` + color.yellow(...message)));
};

exports.message = message => {
    console.log(color.blue(`[APPLIACTION] > ` + color.yellow(...message)));
};

exports.console = (...message) => {
    console.log(...message);
};
