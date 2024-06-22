class Tokenizer {
    constructor(input) {
        this.input = input;
        this.current = 0;
        this.tokens = [];
    }

    tokenize() {
        while (this.current < this.input.length) {
            let char = this.input[this.current];

            if (char === ' ' || char === '\n' || char === '\t') {
                this.current++;
                continue;
            }

            if (char.match(/[a-zA-Z]/)) {
                let value = '';
                while (char && char.match(/[a-zA-Z]/)) {
                    value += char;
                    char = this.input[++this.current];
                }
                this.tokens.push({ type: 'word', value });
                continue;
            }

            if (char.match(/[0-9]/)) {
                let value = '';
                while (char && char.match(/[0-9]/)) {
                    value += char;
                    char = this.input[++this.current];
                }
                this.tokens.push({ type: 'number', value });
                continue;
            }

            if (char === ':') {
                this.tokens.push({ type: 'colon', value: ':' });
                this.current++;
                continue;
            }

            if (char === ',') {
                this.tokens.push({ type: 'comma', value: ',' });
                this.current++;
                continue;
            }

            if (char === '=') {
                this.tokens.push({ type: 'equals', value: '=' });
                this.current++;
                let value = '';
                while (this.current < this.input.length && this.input[this.current] !== ';') {
                    value += this.input[this.current];
                    this.current++;
                }
                this.tokens.push({ type: 'string', value: value.trim() });
                continue;
            }

            if (char === ';') {
                this.tokens.push({ type: 'semicolon', value: ';' });
                this.current++;
                continue;
            }

            this.tokens.push({ type: 'unexpected', value: char });
            this.current++;
        }

        return this.tokens;
    }
}

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
    }

    parse() {
        let ast = {
            type: 'Program',
            body: []
        };

        while (this.current < this.tokens.length) {
            const statement = this.parseStatement();
            if (statement) {
                ast.body.push(statement);
            }
        }

        return ast;
    }

    parseStatement() {
        const token = this.tokens[this.current];

        if (token.type === 'word') {
            if (this.tokens[this.current + 1]?.type === 'colon') {
                return this.parseVariableDeclaration();
            } else if (token.value === 'log') {
                return this.parseLogStatement();
            }
        }

        // Skip unexpected tokens
        this.current++;
        return null;
    }

    parseVariableDeclaration() {
        const identifier = this.tokens[this.current].value;
        this.current += 2; // Skip identifier and colon

        const kind = this.tokens[this.current].value;
        this.current += 2; // Skip kind and comma

        const type = this.tokens[this.current].value;
        this.current += 2; // Skip type and equals

        const value = this.tokens[this.current].value;
        this.current += 2; // Skip value and semicolon

        return {
            type: 'VariableDeclaration',
            identifier,
            kind,
            valueType: type,
            value
        };
    }

    parseLogStatement() {
        this.current++; // Skip 'log'
        const argument = this.tokens[this.current].value;
        this.current += 2; // Skip argument and semicolon

        return {
            type: 'LogStatement',
            argument
        };
    }
}

class Compiler {
    constructor(ast) {
        this.ast = ast;
    }

    compile() {
        let assembly = '';

        this.ast.body.forEach(node => {
            if (node.type === 'VariableDeclaration') {
                assembly += this.compileVariableDeclaration(node);
            } else if (node.type === 'LogStatement') {
                assembly += this.compileLogStatement(node);
            }
        });

        return assembly;
    }

    compileVariableDeclaration(node) {
        return `MOV ${node.identifier}, ${node.value}\n`;
    }

    compileLogStatement(node) {
        return `PRINT ${node.argument}\n`;
    }
}

const code = `hello : constant, string = wow, this works?; log hello;`;

const tokenizer = new Tokenizer(code);
const tokens = tokenizer.tokenize();

const parser = new Parser(tokens);
const ast = parser.parse();

const compiler = new Compiler(ast);
const assemblyCode = compiler.compile();

console.log(assemblyCode);
