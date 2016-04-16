import Logger from "./Logger";

export default Logmon {
  constructor() {
    this.loggers = [];
  }

  createLogger(name) {
    var logger = new Logger(name);
    loggers.push(new Logger(name));
    window[name] = loggers[loggers.length - 1];
    return loggers[loggers.length - 1];
  }

  createLoggerWithOptions(name, testing, consoling) {
    var logger = new Logger(name);
    logger.testing = testing;
    logger.consoling = consoling;
    loggers.push(logger);
    window[name] = loggers[loggers.length - 1];
    return loggers[loggers.length - 1];
  }

  show() {
    for (var i = 0; i < loggers.length; i++) {
      console.log("", loggers[i])
    }
  }

  disableLoggers() {
    for (var i = 0; i < loggers.length; i++) {
      loggers[i].testing = false;
    }
  }

  enableLoggers() {
    for (var i = 0; i < loggers.length; i++) {
      loggers[i].testing = true;
    }
  }
}
