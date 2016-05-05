export class Logmon {
  constructor(windowRef) {
    this.loggers = [];
    this.window = windowRef;
  }
  createLogger(name) {
    this.loggers.push(new Logger(name));
    this.window[name] = this.loggers[this.loggers.length - 1];
    return this.loggers[this.loggers.length - 1];
  }
  createLoggerWithOptions(name, testing, consoling) {
    const logger = new Logger(name);
    logger.testing = testing;
    logger.consoling = consoling;
    this.loggers.push(logger);
    this.window[name] = this.loggers[this.loggers.length - 1];
    return this.loggers[this.loggers.length - 1];
  }
  getLogger(name) {
    for (const logger of this.loggers) {
      if (logger.name === name) {
        return logger;
      }
    }
    return null;
  }
  show() {
    this.loggers.map(logger => {
      console.log("", logger);
    });
  }
  disableLoggers() {
    this.loggers.map(logger => {
      logger.testing = false;
    });
  }
  enableLoggers() {
    this.loggers.map(logger => {
      logger.testing = true;
    });
  }
}

export class Logger {
  constructor(name) {
    this.name = name;
    this.size = 5000;

    this.log = [];
    this.currentIndent = "";
    this.indent = "--- ";

    this.timer = {};

    this.testRunning = "";
    this.testLevel = 0;
    this.testing = true;
    this.consoling = true;
  }
  setTestLevel(level) {
    this.testLevel = level;
  }
  testRun(what) {
    this.testRunning = what;
  }
  resetLogs() {
    this.log = [];
    this.currentIndent = "";
  }
  timerStart(where) {
    if (this.testing) {
      this.timer[where] = performance.now();
    }
  }
  timerEnd(where) {
    if (this.testing) {
      const timed = performance.now() - this.timer[where];
      if (this.consoling) {
        console.log(this.currentIndent + where + " done in time " + timed + "ms");
      }
    }
  }
  append(string) {
    if (this.testing) {
      const logged = this.currentIndent + string;
      if (this.consoling) {
        console.log(logged);
      }
      if (this.log.length === this.size) {
        this.log.splice(0, 1);
      }
      this.log.push(logged);
    }
  }
  start(string) {
    if (this.testing || this.testRunning.length !== 0) {
      var asString = "";
      for (var i = 0; i < arguments.length; i++) {
        asString += arguments[i].toString();
      }
      if (!this.testing && this.testRunning.length !== 0) {
        if (string.indexOf(this.testRunning) !== -1) {
          this.testing = true;
        } else {
          return;
        }
      }
      var logged = this.currentIndent + string;
      // if (this.consoling) {
      // console.log(logged);
      // console.log("arguments size " + arguments.length);
      // console.log(arguments);
      // }
      if (this.log.length === this.size) {
        this.log.splice(0, 1);
      }
      this.log.push(logged);
      this.currentIndent += this.indent;
    }
  }
  end(string) {
    if (this.testing) {
      if (this.testRunning.length !== 0) {
        if (string.indexOf(this.testRunning) !== -1) {
          this.testing = false;
          this.testRunning = "";
        }
      }
      this.currentIndent = this.currentIndent.substring(0, this.currentIndent.length - this.indent.length);
      var logged = this.currentIndent + string;
      if (this.consoling) {
        console.log(logged);
      }
      if (this.log.length === this.size) {
        this.log.splice(0, 1);
      }
      this.log.push(logged);
    }
  }
  trace() {
    console.log(this.log.join("\n"));
    console.log("--- TRACELOG(" + this.name + ") size: " + this.log.length + " ---");
  }
}

let mockWindow = {};
let logmon = new Logmon(mockWindow);
logmon.createLoggerWithOptions("Logdef", false, true);
logmon.createLoggerWithOptions("Logcal", false, true);
export default logmon;
