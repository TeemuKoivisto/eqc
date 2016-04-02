Calculator.service('CalculatorInductor', function (CalculatorUtil, MathSymbol, MathTerm, MathOperation, Logger) {

    this.options = {
        reduceFractions: true,
        "showBracketsAfterReducingIntoOneTerm": false
    }
    
    this.trueInductions = [
        "sig(n,0,n(n+1)) = (n(n+1)(n+2))/3",
        "sig(n,0,n+1) = ((n+1)((n+1)+1))/2"
    ]
    
    this.calculate = function (Location, MathObject) {
        Logger.clog("INDUCTOR calculate: Location " + Location + " MathObject " + MathObject);

        MathObject.order--;
        var locationType = Object.prototype.toString.call(Location) === '[object Array]' ? "Equation" : Location.type;

//        if value is found from the table THEN is the probabality converted into fraction
//        if (locationType === "Equation") {
        if (MathObject.type === "Sum") {
            
        }
    }

// how I set the order?? 
// everytime reset the old and make new?
    this.calculateBasis = function(Equation, Sum) {
        Logger.clogStart("calculateBasis: Equation " + Equation + " Sum " + Sum);
        // should probabaly remove the sum from the equation?
        // or does the replaceVar automatically destroy it?? hmm
        var eqcopy = jQuery.extend(true, {}, Equation);
        var zerotermlist = [new MathTerm('', 0, 0, 0)];
        CalculatorUtil.replaceVariableWithComponent(eqcopy, 'n', zerotermlist);
        // all the reducing should be done in CalcBasic
        // and after checked if both sides are the same
        Logger.clogEnd("FROM calculateBasis: RETURN eqcopy " + eqcopy + " Equation " + Equation + " Sum " + Sum);
        return eqcopy;
    }

    this.calculateInductiveStep = function(Equation, Sum) {
        Logger.clogStart("calculateInductiveStep: Location " + Equation + " Sum " + Sum);
        // should probabaly remove the sum from the equation?
        // or does the replaceVar automatically destroy it?? hmm
        var eqright = jQuery.extend(true, {}, Equation);
        var eqleft  = jQuery.extend(true, {}, Equation);
        var nplusonelist = [new MathTerm('n', 1, 1, 0), new MathTerm('', 1, 0, 0)];
        // replacing the n with n + 1
        CalculatorUtil.findAndReplaceVariable(eqright, eqright.leftside, 'n', nplusonelist);
        eqright.rightside.push.apply(eqright.leftside);
        eqright.leftside = [];
        
        CalculatorUtil.findAndReplaceVariable(eqleft, eqleft.rightside, 'n', nplusonelist);
        eqleft.leftside = [];
        // all the reducing should be done in CalcBasic
        // and after checked if both sides are the same
        // eqright === eqleft
        Logger.clogEnd("FROM calculateInductiveStep: RETURN eqcopy " + eqcopy + " Equation " + Equation + " Sum " + Sum);
        return eqright;
    }
});