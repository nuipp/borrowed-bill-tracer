import Calculator from "../Helpers/Calculator";

test('Simple binary expression', () => {
    const calculator = new Calculator("3+2");
    expect(calculator.evaluate()).toBe(3+2);
})

test('Simple test with parenthesis', () => {
    const calculator = new Calculator("(13+5)*2");
    expect(calculator.evaluate()).toBe((13+5)*2);
})

describe('Calculator Class', () => {
    test('Tokenization: getToken() should correctly tokenize the infix expression', () => {
        const calculator = new Calculator("3 + 5 * (2 - 8)");
        expect(calculator.tokens).toEqual([3, '+', 5, '*', '(', 2, '-', 8, ')']);
    });

    test('Postfix Conversion: convertPostfix() should correctly convert to postfix', () => {
        const calculator = new Calculator("3 + 5 * (2 - 8)");
        expect(calculator.getPostFix()).toBe("3 5 2 8 - * +");
    });

    test('Evaluation: evaluate() should correctly evaluate a valid postfix expression', () => {
        const calculator = new Calculator("3 + 5 * (2 - 8)");
        expect(calculator.evaluate()).toBe(-27);
    });

    test('Single Number: evaluate() should return the number itself for a single-token expression', () => {
        const calculator = new Calculator("42");
        expect(calculator.evaluate()).toBe(42);
    });

    test('Division by Zero: evaluate() should throw an error for division by zero', () => {
        expect(() => {
            const calculator = new Calculator("10 / (5 - 5)");
            calculator.evaluate();
        }).toThrow("Division by zero");
    });

    // test('Invalid Expression: constructor should throw an error for invalid infix expressions', () => {
    //     expect(() => new Calculator("3 + + 5")).toThrow("Expression invalid");
    //     expect(() => new Calculator("(3 + 5")).toThrow("Expression invalid");
    //     expect(() => new Calculator("3 + 5)")).toThrow("Expression invalid");
    // });

    // test('Empty Expression: constructor should throw an error for empty or null expressions', () => {
    //     expect(() => new Calculator("")).toThrow("Expression invalid");
    //     expect(() => new Calculator(null)).toThrow("Expression invalid");
    // });

    test('Complex Expression: evaluate() should correctly evaluate a complex expression', () => {
        const calculator = new Calculator("10 + (6 / 3) * (2 + 3)");
        expect(calculator.evaluate()).toBe(20);
    });

    test('Postfix Expression: getPostFix() should return the correct postfix representation', () => {
        const calculator = new Calculator("10 + (6 / 3) * (2 + 3)");
        expect(calculator.getPostFix()).toBe("10 6 3 / 2 3 + * +");
    });

    test('Invalid Characters: constructor should throw an error for invalid characters', () => {
        expect(() => new Calculator("3 + 5 & 2")).toThrow("Expression invalid");
    });

    test('Edge Case: evaluate() should handle parentheses-only expressions', () => {
        const calculator = new Calculator("(((3)))");
        expect(calculator.evaluate()).toBe(3);
    });

    test('Negative Numbers: evaluate() should correctly handle negative results', () => {
        const calculator = new Calculator("5 - (10 - 7)");
        expect(calculator.evaluate()).toBe(2);
    });
});
