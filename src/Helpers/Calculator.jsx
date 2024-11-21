class Calculator {
    constructor(infixExpression) {
        if (!infixExpression || infixExpression.trim() === "") {
            throw new Error("Expression invalid");
        }
        this.infix = infixExpression;
        this.tokens = this.getToken(infixExpression);
        this.postfix = [];
        if (!this.convertPostfix()) {
            throw new Error("Expression invalid");
        }
    }
    setInfix(infixExpression){
        if (!infixExpression || infixExpression.trim() === "") {
            throw new Error("Expression invalid");
        }
        this.infix = infixExpression;
        this.tokens = this.getToken(infixExpression);
        this.postfix = [];
        if (!this.convertPostfix()) {
            throw new Error("Expression invalid");
        }
    }

    getToken(expression) {
        const tokens = [];
        let currentNumber = "";

        for (let char of expression) {
            if (char >= "0" && char <= "9") {
                // Collect digits for multi-digit numbers
                currentNumber += char;
            } else {
                if (currentNumber) {
                    tokens.push(parseInt(currentNumber, 10)); // Push the complete number
                    currentNumber = "";
                }
                if (char.trim()) {
                    tokens.push(char); // Push operators and parentheses
                }
            }
        }

        if (currentNumber) {
            tokens.push(parseInt(currentNumber, 10)); // Push the last number if exists
        }

        return tokens;
    }

    convertPostfix() {
        const operatorStack = [];
        let openParenthesisCount = 0;

        for (let token of this.tokens) {
            if (typeof token === "number") {
                this.postfix.push(token);
            } else if (token === "(") {
                openParenthesisCount++;
                operatorStack.push(token);
            } else if (token === ")") {
                openParenthesisCount--;
                if (openParenthesisCount < 0) {
                    return false; // More closing parentheses than opening
                }
                while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== "(") {
                    this.postfix.push(operatorStack.pop());
                }
                operatorStack.pop(); // Remove the '('
            } else if ("+-*/%".includes(token)) {
                while (
                    operatorStack.length > 0 &&
                    operatorStack[operatorStack.length - 1] !== "(" &&
                    this.isLesserOrEqualToPrecedence(token, operatorStack[operatorStack.length - 1])
                ) {
                    this.postfix.push(operatorStack.pop());
                }
                operatorStack.push(token);
            } else {
                return false; // Invalid token
            }
        }

        if (openParenthesisCount !== 0) {
            return false; // Mismatched parentheses
        }

        while (operatorStack.length > 0) {
            this.postfix.push(operatorStack.pop());
        }

        return true;
    }

    evaluate() {
        if (this.postfix.length === 0) {
            throw new Error("Infix is not converted to postfix yet");
        }
        const numOperands = []; // Using array as stack

        for (let token of this.postfix) {
            if (typeof token === "number") {
                numOperands.push(token);
            } else {
                if (numOperands.length < 2) {
                    throw new Error("Not enough operands");
                }
                const val2 = numOperands.pop();
                const val1 = numOperands.pop();
                numOperands.push(this.operate(val1, val2, token));
            }
        }

        if (numOperands.length !== 1) {
            throw new Error("Invalid postfix expression");
        }
        return numOperands.pop();
    }

    operate(val1, val2, operator) {
        switch (operator) {
            case "+":
                return val1 + val2;
            case "-":
                return val1 - val2;
            case "*":
                return val1 * val2;
            case "/":
                if (val2 === 0) {
                    throw new Error("Division by zero");
                }
                return Math.floor(val1 / val2);
            case "%":
                return val1 % val2;
            default:
                throw new Error("Operation invalid");
        }
    }

    isLesserOrEqualToPrecedence(a, b) {
        return this.getPriority(a) <= this.getPriority(b);
    }

    getPriority(operator) {
        switch (operator) {
            case "+":
                return 10;
            case "-":
                return 5;
            case "*":
            case "/":
            case "%":
                return 20;
            default:
                return 0;
        }
    }

    getPostFix() {
        if (this.postfix.length > 0) {
            return this.postfix.join(" ");
        }
        throw new Error("Postfix not converted yet");
    }

    toString() {
        return `${this.infix} : ${this.getPostFix()} = ${this.evaluate()}`;
    }
}
export default Calculator
