class PrefixParser{
    constructor(infix){
        this.infix = infix?infix:""
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
        console.log(" My output is " + t)
        return t
    }
    
    isNumber(c){
        return (c >= '0' && c <= '9')
    }
}
export default PrefixParser;