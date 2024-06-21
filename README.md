[Basics](#Basics)

## Basics
Defines the log function. Parameter inputs is typed and only will allow string and num. 
```
log : func = (...inputs: string, num :){
    console.log(inputs)
};
```

Defines the hello variable. It is typed as constant and string. The variable contains `“wow, this works?”`
```
hello : constant, string = wow, this works?;
```

The variable hello gets logged by the function log.
```
log hello;
```

If you want example the ; to be inside the string. Just remember to add a ; afterwards. This will define the variable hello as a constant and string. With the value of `“wow, this works?;”`
```
hello : constant, string = (wow, this works?;);
```

## Types

### Introduction
Types are only for safety of the code and is NOT needed. You will get an error if you give a type that the input did not allow. So it is recommended to use types.

### Edge cases
If you don't give a type to the variable, the compiler tries to find out what it should do with the value. this can get problematic.
This is an edge case where the compiler don't know what to do:
```
hello = hello there, how is it going?;
```
The compiler does not know how to store the value. Should it be a string? Array?
**If you have some ideas how to handle this, please do give me the ideas :)**

### Why you should use types
* As mentioned before. A lot of functions uses types and will most probably give an error if it gets the wrong type.
* Types can be used for optimization. This is because some types allows you to give some memory properties. The basic once being const, var and let. But you can too make the variable a pointer. If you know some C or C++, you probably know what this is. This allows you to set the variable to the address of another variable.
  ```
  // I have never used pointers my self, so please do give me feedback on this.
  hello : string = "wow";
  testPointer : pointer = hello
  ```
