// Defines the log function. Parameter inputs is typed and only will allow string and num. 
```
log : func = (...inputs: string, num :){
    console.log(inputs)
};
```

// Defines the hello variable. It is typed as constant and string. The variable contains `“wow, this works?”`
```
hello : constant, string = wow, this works?;
```

// The variable hello gets logged by the function log.
```
log hello;
```

// If you want example the ; to be inside the string. Just remember to add a ; afterwards. This will define the variable hello as a constant and string. With the value of `“wow, this works?;”`
```
hello : constant, string = (wow, this works?;);
```
