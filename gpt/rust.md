Creating a basic compiler for your language in Rust involves several key steps: defining the syntax, parsing the syntax, and generating some form of output (e.g., bytecode, another language, etc.). Here’s a simple example to get you started:

### Step 1: Define the Syntax
From your README, the syntax involves functions, variables, constants, and settings. We'll start by creating a basic parser for these elements.

### Step 2: Setup the Rust Project
Create a new Rust project using Cargo:
```sh
cargo new my_language_compiler
cd my_language_compiler
```

### Step 3: Define the Tokenizer
The tokenizer breaks the input code into tokens.

```rust
// src/tokenizer.rs
#[derive(Debug, PartialEq)]
pub enum Token {
    Func,
    Const,
    Var,
    Let,
    Pointer,
    StringLiteral(String),
    Identifier(String),
    Equals,
    Semicolon,
    Comma,
    Colon,
    OpenParen,
    CloseParen,
    EOF,
}

pub struct Tokenizer<'a> {
    input: &'a str,
    position: usize,
    read_position: usize,
    ch: Option<char>,
}

impl<'a> Tokenizer<'a> {
    pub fn new(input: &'a str) -> Self {
        let mut tokenizer = Tokenizer {
            input,
            position: 0,
            read_position: 0,
            ch: None,
        };
        tokenizer.read_char();
        tokenizer
    }

    fn read_char(&mut self) {
        self.ch = if self.read_position >= self.input.len() {
            None
        } else {
            Some(self.input.as_bytes()[self.read_position] as char)
        };
        self.position = self.read_position;
        self.read_position += 1;
    }

    pub fn next_token(&mut self) -> Token {
        self.skip_whitespace();
        let token = match self.ch {
            Some('=') => Token::Equals,
            Some(';') => Token::Semicolon,
            Some(',') => Token::Comma,
            Some(':') => Token::Colon,
            Some('(') => Token::OpenParen,
            Some(')') => Token::CloseParen,
            Some('"') => {
                let literal = self.read_string();
                Token::StringLiteral(literal)
            },
            Some(ch) if ch.is_alphabetic() => {
                let ident = self.read_identifier();
                match ident.as_str() {
                    "func" => Token::Func,
                    "const" => Token::Const,
                    "var" => Token::Var,
                    "let" => Token::Let,
                    "pointer" => Token::Pointer,
                    _ => Token::Identifier(ident),
                }
            },
            None => Token::EOF,
            _ => panic!("unexpected character"),
        };
        self.read_char();
        token
    }

    fn skip_whitespace(&mut self) {
        while let Some(ch) = self.ch {
            if ch.is_whitespace() {
                self.read_char();
            } else {
                break;
            }
        }
    }

    fn read_string(&mut self) -> String {
        let mut literal = String::new();
        loop {
            self.read_char();
            match self.ch {
                Some('"') => break,
                Some(ch) => literal.push(ch),
                None => break,
            }
        }
        literal
    }

    fn read_identifier(&mut self) -> String {
        let position = self.position;
        while let Some(ch) = self.ch {
            if ch.is_alphanumeric() {
                self.read_char();
            } else {
                break;
            }
        }
        self.input[position..self.position].to_string()
    }
}
```

### Step 4: Create the Parser
The parser will convert the tokens into an Abstract Syntax Tree (AST).

```rust
// src/parser.rs
use crate::tokenizer::{Token, Tokenizer};

#[derive(Debug)]
pub enum Statement {
    VariableDeclaration {
        name: String,
        var_type: String,
        value: String,
    },
    FunctionDeclaration {
        name: String,
        params: Vec<(String, String)>,
        body: Vec<Statement>,
    },
}

pub struct Parser<'a> {
    tokenizer: Tokenizer<'a>,
    current_token: Token,
    peek_token: Token,
}

impl<'a> Parser<'a> {
    pub fn new(mut tokenizer: Tokenizer<'a>) -> Self {
        let current_token = tokenizer.next_token();
        let peek_token = tokenizer.next_token();
        Parser {
            tokenizer,
            current_token,
            peek_token,
        }
    }

    fn next_token(&mut self) {
        self.current_token = std::mem::replace(&mut self.peek_token, self.tokenizer.next_token());
    }

    pub fn parse_program(&mut self) -> Vec<Statement> {
        let mut statements = Vec::new();
        while self.current_token != Token::EOF {
            let stmt = self.parse_statement();
            statements.push(stmt);
            self.next_token();
        }
        statements
    }

    fn parse_statement(&mut self) -> Statement {
        match &self.current_token {
            Token::Identifier(ident) if ident == "let" || ident == "const" || ident == "var" => {
                self.parse_variable_declaration()
            },
            Token::Func => self.parse_function_declaration(),
            _ => panic!("unexpected token"),
        }
    }

    fn parse_variable_declaration(&mut self) -> Statement {
        let var_type = match &self.current_token {
            Token::Identifier(ident) => ident.clone(),
            _ => panic!("expected variable type"),
        };
        self.next_token();
        let name = match &self.current_token {
            Token::Identifier(ident) => ident.clone(),
            _ => panic!("expected variable name"),
        };
        self.next_token();
        self.expect_token(Token::Equals);
        self.next_token();
        let value = match &self.current_token {
            Token::StringLiteral(lit) => lit.clone(),
            _ => panic!("expected variable value"),
        };
        self.next_token();
        self.expect_token(Token::Semicolon);
        Statement::VariableDeclaration {
            name,
            var_type,
            value,
        }
    }

    fn parse_function_declaration(&mut self) -> Statement {
        self.next_token();
        let name = match &self.current_token {
            Token::Identifier(ident) => ident.clone(),
            _ => panic!("expected function name"),
        };
        self.next_token();
        self.expect_token(Token::OpenParen);
        let mut params = Vec::new();
        while self.peek_token != Token::CloseParen {
            self.next_token();
            let param_name = match &self.current_token {
                Token::Identifier(ident) => ident.clone(),
                _ => panic!("expected parameter name"),
            };
            self.next_token();
            self.expect_token(Token::Colon);
            self.next_token();
            let param_type = match &self.current_token {
                Token::Identifier(ident) => ident.clone(),
                _ => panic!("expected parameter type"),
            };
            params.push((param_name, param_type));
            if self.peek_token == Token::Comma {
                self.next_token();
            }
        }
        self.expect_token(Token::CloseParen);
        let mut body = Vec::new();
        while self.peek_token != Token::EOF {
            self.next_token();
            let stmt = self.parse_statement();
            body.push(stmt);
        }
        Statement::FunctionDeclaration { name, params, body }
    }

    fn expect_token(&mut self, expected: Token) {
        if self.current_token != expected {
            panic!("expected {:?}, got {:?}", expected, self.current_token);
        }
    }
}
```

### Step 5: Integrate Tokenizer and Parser
Integrate the tokenizer and parser in the main function.

```rust
// src/main.rs
mod tokenizer;
mod parser;

use tokenizer::Tokenizer;
use parser::Parser;

fn main() {
    let input = r#"
    hello : constant, string = wow, this works?;
    log : func = (...inputs: string, num :){
        console.log(inputs)
    };
    "#;
    
    let tokenizer = Tokenizer::new(input);
    let mut parser = Parser::new(tokenizer);
    let program = parser.parse_program();
    
    for statement in program {
        println!("{:?}", statement);
    }
}
```

This example covers the basics of tokenizing and parsing a simple language. You can expand upon it by adding more features from your language, handling more edge cases, and implementing code generation.
