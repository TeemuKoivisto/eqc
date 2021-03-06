import Logger from "../../utility_services/Logger";
import Logmon from "../../utility_services/Logmon";
const Logcal = Logmon.getLogger("Logcal");
import Orderer from "../../utility_services/Orderer";

import Utility from "../utility/Utility";

import Calculator from "../Calculator";

import MathTerm from "../../math-components/basic/MathTerm";
import MathOperation from "../../math-components/basic/MathOperation";
import MathSymbol from "../../math-components/basic/MathSymbol";
import MathProbability from "../../math-components/probability/MathProbability";

class Probability extends Calculator {

  constructor() {
    super("Probability");

    // default probability table that is always loaded
    this.pTable = {
      raw: [
        ['', 'Apina', 'Gorilla'],
        ['Kyllä', 4, 3],
        ['Ei', 2, 1]
      ],
      refined: [
        ['', { key: 'Apina', variations: ['A'] }, { key: 'Gorilla', variations: ['G'] }, { key: 'Yhteensä', variations: [''] }],
        [{ key: 'Kyllä', variations: ['K'] }, 4, 3, 7],
        [{ key: 'Ei', variations: ['E'] }, 2, 1, 3],
        [{ key: 'Yht', variations: [''] }, 6, 4, 10]
      ],
      keys: [
        { key: 'Apina', row: 0, column: 1, variations: ['A'] },
        { key: 'Gorilla', row: 0, column: 2, variations: ['G'] },
        { key: 'Kyllä', row: 1, column: 0, variations: ['K'] },
        { key: 'Ei', row: 2, column: 0, variations: ['E'] }
      ],
      keymap: [
        { keys: ['K', 'A'], row: 1, column: 1 },
        { keys: ['K', 'G'], row: 1, column: 2 },
        { keys: ['E', 'A'], row: 2, column: 1 },
        { keys: ['E', 'G'], row: 2, column: 2 },
      ],
    }
  }
  
  resetTables() {
  
  }
  
  loadTable(ptable) {
    this.pTable = ptable;
  }
  
  // TODO add this formula? P\left(A\cap B\right)=\frac{n\left(A\&B\right)}{n}
  // cap = and, cup = or, mid = |, complement = ',
  // needs support for operations that include probabilities P(A cap B cap C) etc.
  calculate(Location, MathObject) {
    Logcal.start('CalculatorProbability calculate: Location ' + Location + ' MathObject ' + MathObject);
    if (this.checkIfConvertable(MathObject)) {
      if (this.hasComplement(MathObject)) {
        // P(A and B)^c = 1 - P(A and B) >> complement
        var conversion = [new MathTerm('', 1, '')];
        var prob = Utility.cloneProbabilityWithoutExponent(MathObject);
        prob.switchSign();
        conversion.push(prob);
        Logger.newLatexWithFormula("Converting $" + MathObject.toLatex() + "$ to $" + Utility.arrayToLatex(conversion) + "$", 'Probability: complement', 0);
        Utility.replaceSingleComponentWithList(Location, MathObject, conversion);
        } else if (MathObject.toSymbols() === "term") {
          if (MathObject.content[0].exponent) {
            this.convertProbabilityToProbability(Location, MathObject);
          } else {
            this.convertProbabilityToFraction(Location, MathObject);
          }
        } else if (MathObject.toSymbols() === "term-cap-term") {
          this.convertProbabilityToFraction(Location, MathObject);
        } else if (MathObject.toSymbols() === "term-cup-term") {
          this.convertProbabilityToProbability(Location, MathObject);
      } else if (MathObject.toSymbols() === "term-mid-term") {
          this.convertProbabilityToProbability(Location, MathObject);
      } else if (MathObject.toSymbols() === "term-setminus-term") {
          this.convertProbabilityToProbability(Location, MathObject);
      } else {
        throw("some bigger probability combo that is not supported yet");
      }
    }
    Logcal.end('FROM CalculatorProbability calculate: Location ' + Location + ' MathObject ' + MathObject);
  }

  findKey(key) {
    for(var i = 0; i < this.pTable.keys.length; i++) {
      if (this.pTable.keys[i].key === key || this.pTable.keys[i].variations.indexOf(key) !== -1) {
        return this.pTable.keys[i];
      }
    }
    return '';
  }
  
  // currently not supported
  checkIfIndependent(First, Second) {
    return false;
  }
  
  // not supported
  checkIfEventsSimultaneous(First, Second) {
    return true;
  }
  
  checkIfExclusive(FirstTerm, SecondTerm) {
    return this.getValueWithKeys(FirstTerm, SecondTerm) === 0;
  }
  
  checkIfConvertable(Probability) {
    for(var index in Probability.content) {
      if (Probability.content[index].type === "Symbol") {
        var symbol = Probability.content[index].command;
        if (symbol !== "cup" && symbol !== "cap" && symbol !== "mid") {
          return false;
        }
      } else if (Probability.content[index].type === "Term") {
        // doesn't check exponent or term value
        var found = this.findKey(Probability.content[index].variable);
        return found && found.length !== 0; // checks if found is null meaning not found
      } else {
        return false;
      }
    }
    return true;
  }

  findAmount () {
    var tableRows = this.pTable.refined.length;
    var tableColumns = this.pTable.refined[0].length;
    return this.pTable.refined[tableRows-1][tableColumns-1];
  }
  
  getValueWithKey(term) {
    Logcal.append('getValueWithKey: term ' + term);
    var total = 0;
    var firstIsC = this.hasComplement(term);
    var firstkey = term.variable;
    
    for (var k = 0; k < this.pTable.keymap.length; k++) {
      var value = this.pTable.keymap[k];
      if (firstIsC === (value.keys.indexOf(firstkey) === -1)) {
      total += this.pTable.refined[value.row][value.column];
      }
    }
    return total;
  }
  
  getValueWithKeys(firstterm, secondterm) {
    Logcal.start('getValueWithKeys: firstterm ' + firstterm + ' secondterm ' + secondterm);
    var firstkey = firstterm.variable;
    var secondkey = secondterm.variable;
      if (firstkey === secondkey && this.hasComplement(firstterm) && this.hasComplement(secondterm)) {
        Logcal.end('FROM getValueWithKeys: firstterm ' + firstterm + ' secondterm ' + secondterm + ' RETURN >getValueForKey');
        // TODO uses set rule A∩A=A
        return this.getValueWithKey(firstterm);
      }
    var total = 0;
    var firstIsC = this.hasComplement(firstterm);
    var secondIsC = this.hasComplement(secondterm);
    
    for (var k = 0; k < this.pTable.keymap.length; k++) {
      var value = this.pTable.keymap[k];
      // console.log('value is ', value)
      // console.log('loytyko eka ' + firstkey + ' ', value.keys.indexOf(firstkey))
      // console.log(firstIsC);
      // console.log('loytyko toka ' + secondkey + ' ', value.keys.indexOf(secondkey))
      // console.log(secondIsC);
      if (firstIsC === (value.keys.indexOf(firstkey) === -1) && secondIsC === (value.keys.indexOf(secondkey) === -1)) {
      total += this.pTable.refined[value.row][value.column];
      }
    }
    Logcal.end('FROM getValueWithKeys: firstterm ' + firstterm + ' secondterm ' + secondterm + ' RETURN total ' + total);
    return total;
  }
  
  convertProbabilityToFraction(Location, Probability) {
    Logcal.append("convertProbabilityToFraction: Location " + Location + " Probability " + Probability);
    if (Probability.toSymbols()!=='term') {
      if (Probability.toSymbols() === 'term-cap-term') {
        // var numerator = this.getValueForKeysIntersection(Probability.content[0].variable, Probability.content[2].variable);
    var numerator = this.getValueWithKeys(Probability.content[0], Probability.content[2]);
        var denominator = this.findAmount();
        var operation = new MathOperation(new MathTerm('', numerator, ''), '/', new MathTerm('', denominator, ''));
        if (Probability.minussign) {
          operation.switchSign();
        }
        Logger.newLatex("Converting $" + Probability.toLatex() + "$ to $" + operation.toLatex() + "$");
        Utility.replaceSingleComponentWithComponent(Location, Probability, operation);
      } else {
        throw("wtf was type " + Probability);
      }
    } else {
      // var numerator = this.getValueForKey(Probability.content[0].variable);
      var numerator = this.getValueWithKey(Probability.content[0]);
      var denominator = this.findAmount();
      var operation = new MathOperation(new MathTerm('', numerator, ''), '/', new MathTerm('', denominator, ''));
      if (Probability.minussign) {
        operation.switchSign();
      }
      Logger.newLatex("Converting $" + Probability.toLatex() + "$ to $" + operation.toLatex() + "$");
      Utility.replaceSingleComponentWithComponent(Location, Probability, operation);
    }
  }

  convertProbabilityToProbability(Location, Probability) {
    Logcal.append("convertProbabilityToProbability: Location " + Location + " Probability " + Probability);
    var list = this.findAvailableConversion(Probability);
    if (Probability.minussign) {
      for (var i = 0; i < list.length; i++) {
      list[i].switchSign();
      }
    }
    // Logger.newLatex("Converting $" + Probability.toLatex() + "$ to $" + Utility.arrayToLatex(list) + "$");
    if (list.length > 1) {
      Utility.replaceSingleComponentWithList(Location, Probability, list);
    } else if (list.length === 1) {
      Utility.replaceSingleComponentWithComponent(Location, Probability, list[0]);
    } else {
      throw("no available conversions found " + Probability);
    }
  }

  // finds ONE available conversion for unknown Probability
  findAvailableConversion(Probability) {
    Logcal.start("findAvailableConversion: Probability " + Probability);
    var conversion = [];

    if (Probability.toSymbols() !== 'term') {
      var firstterm = Probability.content[0];
      var symbol = Probability.content[1].command;
      var secondterm = Probability.content[2];
      // console.log("ega " + firstterm + " symbole on " + symbol + " ja toka " + secondterm);
      var independent = this.checkIfIndependent(firstterm.variable, secondterm.variable);
      if (symbol === "cap") {
        // if unindependent
        if (!independent) {
          // P(A and B) = P(A) * P(B)
          var operation = new MathOperation(new MathProbability([firstterm]), '*', new MathProbability([secondterm]));
          conversion.push(operation);
          Logger.newLatexWithFormula("Converting $" + Probability.toLatex() + "$ to $" + Utility.arrayToLatex(conversion) + "$", 'Probability: and (not independent)', 0);
        } else {
          // P(A and B) = P(A|B) * P(B)
          // or
          // P(A and B) = P(B|A) * P(A)
          var first = new MathProbability([firstterm, new MathSymbol('mid'), secondterm]);
          var operation = new MathOperation(first, '*', new MathProbability([secondterm]));
          conversion.push(operation);
          Logger.newLatexWithFormula("Converting $" + Probability.toLatex() + "$ to $" + Utility.arrayToLatex(conversion) + "$", 'Probability: and (independent)', 0);
        }
      } else if (symbol === "cup") {
        // if mutually exlusive
        // jos sarakkeet eivät mene ristiin eli
        // A tai G = true A tai E = false
        // K tai E = true K tai G = false
        var exclusive = this.checkIfExclusive(firstterm, secondterm);
        if (exclusive) {
          // P(A or B) = P(A) + P(B)
          conversion.push(new MathProbability([firstterm]));
          conversion.push(new MathProbability([secondterm]));
          Logger.newLatexWithFormula("Converting $" + Probability.toLatex() + "$ to $" + Utility.arrayToLatex(conversion) + "$", 'Probability: or (mutually exclusive)', 0);
        } else {
          // P(A or B) = P(A) + P(B) - P(A and B)
          conversion.push(new MathProbability([firstterm]));
          conversion.push(new MathProbability([secondterm]));
          var third = new MathProbability([Utility.cloneTerm(firstterm), new MathSymbol('cap'), Utility.cloneTerm(secondterm)]);
          third.switchSign();
          conversion.push(third);
          Logger.newLatexWithFormula("Converting $" + Probability.toLatex() + "$ to $" + Utility.arrayToLatex(conversion) + "$", 'Probability: or (mutually not exclusive)', 0);
        }
      } else if (symbol === "mid") {
        if (!independent) {
          // P(A|B) = P(A and B) / P(B)
          // or .. maybe needs another conversion...
          // P(A|B) = P(B|A) * P(A) / P(B)
          var first = new MathProbability([firstterm, new MathSymbol('cap'), secondterm]);
          var second = new MathProbability([Utility.cloneTerm(secondterm)]);
          var operation = new MathOperation(first, '/', second);
          conversion.push(operation);
          Logger.newLatexWithFormula("Converting $" + Probability.toLatex() + "$ to $" + Utility.arrayToLatex(conversion) + "$", 'Probability: conditional (not independent)', 0);
        } else {
          // P(A|B) = P(A)
          var first = new MathProbability([firstterm]);
          conversion.push(first);
          Logger.newLatexWithFormula("Converting $" + Probability.toLatex() + "$ to $" + Utility.arrayToLatex(conversion) + "$", 'Probability: conditional (independent)', 0);
        }
      } else if (symbol === "setminus") {
        // no difference between independent and non independent?
        // P(A\B) = P(A and B')
        var second = Utility.cloneTerm(secondterm);
        if (!this.hasComplement(secondterm)) {
          second.exponent = new MathSymbol('mathsf{c}');      
        } else {
          second.exponent = '';
        }
        var intersection = new MathProbability([firstterm, new MathSymbol('cap'), second]);
        conversion.push(intersection);
        Logger.newLatexWithFormula("Converting $" + Probability.toLatex() + "$ to $" + Utility.arrayToLatex(conversion) + "$", 'Probability: relative complement', 0);
      }
    } else {
      // if (Probability.content[0].exponent && (Probability.content[0].exponent.toString() === "mathsf{c}" || Probability.content[0].exponent.toString() === "'")) {
      if (this.hasComplement(Probability.content[0])) {
        // P(A^c) = 1 - P(A) >> complement of A
        conversion.push(new MathTerm('', 1, ''));
        var prob = Utility.cloneProbabilityWithoutExponent(Probability);
        prob.content[0].exponent = "";
        prob.switchSign();
        conversion.push(prob);
        Logger.newLatexWithFormula("Converting $" + Probability.toLatex() + "$ to $" + Utility.arrayToLatex(conversion) + "$", 'Probability: complement', 0);
      } else {
        // add P(A)=P(A|B)
        console.log(Probability.toSymbols())
        throw("no available conversions for " + Probability);
      }
    }
    Logcal.end("FROM findAvailableConversion: Probability " + Probability + " RETURN conversion " + conversion);
    return conversion;
  }
  
  // this.createComplement(Probability) {
  // // P(A and B)^c = 1 - P(A and B) >> complement
  // var conversion = [new MathTerm('', 1, '')];
  // var prob = Utility.cloneProbabilityWithoutExponent(Probability);
  // prob.switchSign();
  // conversion.push(prob);
  // Logger.newLatexWithFormula("Converting $" + Probability.toLatex() + "$ to $" + Utility.arrayToLatex(conversion) + "$", 'Probability: complement', 0);
  // Utility.replaceSingleComponentWithList(Location, Probability, conversion);
  // }
  
  hasComplement(MathObject) {
    // return (MathObject.exponent && MathObject.length !== 0 && (MathObject.exponent.toString() === "mathsf{c}" || MathObject.exponent.toString() === "'"))
    if (MathObject.exponent && MathObject.length !== 0 && (MathObject.exponent.command === "mathsf{c}"
     || MathObject.exponent.command === "'")) {
      return true;
    } else {
      return false;
    }
  }
}

export default new Probability();