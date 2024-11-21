import Calculator from "./Calculator";

/**
 * Has infix => Can contain = inside the expression, or at the last (4+2)/2=/1=
 * calResult returns the array of objects -> With result at the last: For eg: Above will return [(4+2/2), 3/1, 3] , Last element is the answer
 */
class PrefixParser{
    constructor(infix){
        this.infix = infix?infix:""
    }

    convertArrayToString(input){
        return input.reduce((acc, c) => c = acc + c, '')
    }

    get calResult(){
        //Returns array, that removes = from the token
        let calResult = [];
        let expression = "";
        const calculator = new Calculator("1");
        for(const token of this.tokens){
            if(token == "="){
                //We pressed =, need to push, and create result in expression
                calculator.setInfix(expression)
                calResult.push(expression)
                expression = calculator.evaluate()
            }
            else{
                expression += token
            }
        }
        calResult.push(expression)
        if(this.tokens[this.tokens.length-1] != "="){
            calculator.setInfix(expression)
            calResult.push(calculator.evaluate())
        }
        return calResult
    }

    get prefix(){
        //Incorrect
        return this.infix;
    }

    get tokens(){

        let currentValue = undefined
        let t = []
        for (let i = 0; i < this.infix.length; i++){
            let c = this.infix[i];
            if(!this.isNumber(c)){
                //There is first possibility for currentValue to be stored first
                if(currentValue != undefined)
                    t.push(Number.parseInt(currentValue))
                //Adding this operator or whatever it is
                t.push(c);
                //Always reset currentValue
                currentValue = undefined;
            }
            else{ //C is a number here
                if(currentValue == undefined){
                    currentValue = Number.parseInt(c)
                }
                else{
                    currentValue = currentValue * 10 + Number.parseInt(c);
                }
            }
        }
        if(currentValue != undefined)
            t.push(currentValue)
        return t
    }

    get validInfixPattern(){
        
    }
    
    isNumber(c){
        return (c >= '0' && c <= '9')
    }
}
export default PrefixParser;