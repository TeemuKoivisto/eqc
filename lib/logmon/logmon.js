var logmon = (function() {

  var loggers = [];

  this.createLogger = function(name) {
    var logger = new Logger(name);
    loggers.push(new Logger(name));
    window[name] = loggers[loggers.length - 1];
    return loggers[loggers.length - 1];
  }

  this.createLoggerWithOptions = function(name, testing, consoling) {
    var logger = new Logger(name);
    logger.testing = testing;
    logger.consoling = consoling;
    loggers.push(logger);
    window[name] = loggers[loggers.length - 1];
    return loggers[loggers.length - 1];
  }

  this.show = function() {
    for (var i = 0; i < loggers.length; i++) {
      console.log('', loggers[i])
    }
  }

  this.disableLoggers = function() {
    for (var i = 0; i < loggers.length; i++) {
      loggers[i].testing = false;
    }
  }

  this.enableLoggers = function() {
    for (var i = 0; i < loggers.length; i++) {
      loggers[i].testing = true;
    }
  }

  function Logger(name) {
    this.name = name;
    this.size = 5000;

    this.log = [];
    this.currentIndent = '';
    this.indent = '--- '

    this.timer = {};

    this.testRunning = '';
    this.testLevel = 0;
    this.testing = true;
    this.consoling = true;
  }

  // Logger.prototype.testing = function(which) {
  // this.testing = which;
  // }

  // Logger.prototype.consoling = function(which) {
  // this.consoling = which;
  // }

  Logger.prototype.setLevel = function(level) {
    this.testLevel = level;
  }

  Logger.prototype.testRun = function(what) {
    this.testRunning = what;
  }

  Logger.prototype.resetLogs = function() {
    this.log = [];
    this.currentIndent = '';
  }

  Logger.prototype.timerStart = function(where) {
    if (this.testing) {
      this.timer[where] = performance.now();
    }
  }

  Logger.prototype.timerEnd = function(where) {
    if (this.testing) {
      var timed = performance.now() - this.timer[where];
      if (this.consoling) {
        console.log(this.currentIndent + where + ' done in time ' + timed + 'ms');
      }
    }
  }

  Logger.prototype.append = function(string) {
    if (this.testing) {
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

  Logger.prototype.start = function(string) {
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

  Logger.prototype.end = function(string) {
    if (this.testing) {
      if (this.testRunning.length !== 0) {
        if (string.indexOf(this.testRunning) !== -1) {
          this.testing = false;
          this.testRunning = '';
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

  Logger.prototype.trace = function() {
    console.log(this.log.join('\n'));
    console.log('--- TRACELOG(' + this.name + ') size: ' + this.log.length + ' ---');
    // for (var i = 0; i < this.log.length; i++) {
    // string += "\n" + this.log[i];
    // }
    // return string;
  }

  return {
    create: createLogger,
    createOpt: createLoggerWithOptions,
    disable: disableLoggers,
    enable: enableLoggers,
    show: show
  }
})()

window.Logmon = logmon;
logmon.createOpt('Logdef', false, true);
logmon.createOpt('Logtic', true, true);
logmon.createOpt('LogmodEng', true, true);

/*

lisää tasot loglausekkeille. eli 0 niinku ihan paskaa, 1 ylöspäin jne.
ja sit ku ei jaksa siirtää muita ylöspäin ni voi mennä vielä alemmaksi eli -1 jne.
ja ehkä ottaa myös stringejä, niin voi kirjoittaa warn, error, jne.
tai omat metodit? Logdef.warn('inside this shit is something about the get rekt')

Toi console:n käyttö että voi käyttää overloadingia ja objekti-viittauksia on aika MUST


Gotta log them all!

Tiny logging library to help front-end js-development. Easy to use, easy to modify.
Create different loggers for different parts of your app and enable them straight away
or from your developer-tools when you need them. Much more flexible to use than those
pesky console.logs that you comment out and then month later comment in and don't
remember what the hell they were supposed to tell you.

And you can always use gulp-replace to remove them from your production code.
Or do whatever, if Logmon is disabled it shouldn't really affect your execution speed
too much.

The way I use Logmon is to describe in main method the class/service/whatever i.e.
Logmyser.start('MyService getSomeStuff: parameter ' + parameter);

And in between the main method I don't have to write which class I'm in so I'll just
write depending how long the method is and how much shit is done i.e.
Logmyser.start('weeLoop: loop ' + loop + ' index ' + index);
or
Logmyser.append('importantMethod: CONDITION sinep === palindrome'); <- for important if-statements

There ain't rules that you must follow. Just to try to be logical and structured, please.
Logging is supposed to help developers to understand the code, not confuse them even more.

And when you are done with any of the start -statements you HAVE to end them i.e.

Logser.end('FROM MyService getSomeStuff: parameter ' + parameter + " RETURN thingy " + thingy);

*/
