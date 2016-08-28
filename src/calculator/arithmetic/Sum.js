import Logger from "../../utility_services/Logger";
import Logmon from "../../utility_services/Logmon";
const Logcal = Logmon.getLogger("Logcal");
import Orderer from "../../utility_services/Orderer";

import Utility from "../utility/Utility";

import Calculator from "../Calculator";

class Sum extends Calculator {

  constructor() {
    super("Sum");
  }

  sumList(list) {
    Logcal.start("sumList: list " + list);
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < list.length; j++) {
        var functionname = "sum" + list[i].type + "And" + list[j].type;
        if (i !== j && this[functionname](list[i], list[j])) {
          list.splice(j, 1);
          j--;
          if (list[i].isEmpty() && list.length !== 1) {
            Logcal.append("CONDITION TRUE " + list[i] + ".isEmpty() && " + list + ".length !== 1");
            list.splice(i, 1);
            i--;
            break;
          }
        }
      }
    }
    Logcal.end("FROM sumList: list " + list);
  }

  sumTermAndTerm(Augent, Addend) {
    Logcal.append("sumTermAndTerm: Augent " + Augent + " Addend " + Addend);
    //                if (termToBeAdded.exponent === this.exponent && termToBeAdded.variable === this.variable) {
    if (Utility.areExponentsEqual(Augent, Addend) && Addend.variable === Augent.variable) {
      //        if (Addend.variablevalue === Augent.variablevalue && Addend.variable === Augent.variable) {
      Logger.newLatex("Summing " + Augent + " and " + Addend);
      Augent.plusValue(Addend.value);
      if (Augent.getValue() === 0) {
        Augent.setValue(0);
        Augent.variable = "";
        Augent.exponent = "";
      }
      return true;
    }
    return false;
  }
}

export default new Sum();