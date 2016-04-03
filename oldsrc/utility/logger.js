OppiApp.service('Logger', function(ApiService) {
  this.log = [];
  this.message = '';

  this.equation;

  this.setEquation = function(equation) {
    this.equation = equation;
    this.log = [];
    this.message = '';
  }

  this.resetLogs = function() {
    this.log = [];
    this.message = '';
  };

  this.setMessage = function(msg) {
    this.message = msg;
  }

  this.createLatex = function(name, latex) {
    this.log.push({
      latex: latex,
      stepName: name,
      formula: ''
    })
  };

  this.newLatex = function(name) {
    this.log.push({
      latex: this.equation.toLatex(),
      stepName: name,
      formula: ''
    })
  };

  this.newLatexWithFormula = function(name, formulaName, variation) {
    var formula = ApiService.getFormulaByName(formulaName);

    if (typeof formula === 'object') {
      name += '\nUsing formula $' + formula.variations[variation].latex + '$';
    }

    this.log.push({
      latex: this.equation.toLatex(),
      stepName: name,
      formula: formula
    })

    // var context = this;
    // var index = this.log.length-1;
    // ApiService.getFormulaByName(formulaName)
    // .then(function(formula) {
    // context.log.splice(index, 0, {
    // latex: this.equation.toLatex(),
    // stepName: name,
    // formula: typeof formula === 'string' ? '' : formula.latex
    // })
    // })
  }
});
