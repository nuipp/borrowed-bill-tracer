import PrefixParser from "../Helpers/PrefixParser"

test('Empty value gives empty string', () => {
    let parser = new PrefixParser();
    expect(parser.infix).toBe('');
})

test('Can set and initialize infix', () => {
    let parser = new PrefixParser('value');
    expect(parser.infix).toBe('value');
    parser.infix = 'change'
    expect(parser.infix).toBe('change');
})

test('test isNumber method', () => {
    let parser = new PrefixParser('4+23');
    expect(parser.isNumber('0')).toBe(true);
    expect(parser.isNumber('1')).toBe(true);
    expect(parser.isNumber('7')).toBe(true);
    expect(parser.isNumber('9')).toBe(true);
    //Testing some other symbols
    expect(parser.isNumber('a')).toBe(false);
})

test('test tokens getter method', () => {
    let parser = new PrefixParser('4+23');
    expect(parser.tokens).toEqual([4, '+', 23]);
    parser.infix = "332+4+435)4"
    expect(parser.tokens).toEqual([332, '+', 4, '+', 435, ')', 4]);
})