## Navigation:
* [Basics](#Basics)
* [Types](#Types)

## Stuff I want to achieve
I want the language to be easy to use, write and understand for any skill levels, while not limiting the advanced stuff.

Compile to any platform. This will most probably use other languages to compile to. So APIs will sometimes not be accessible to every platform/language. 

The language should feel like yours, so this is one of the first (which I know of) that can customize the language.

Vscode extensions that helps develop the language. Like syntax highlight. Let you know what API is usable where, and give you warnings if you are using stuff that is only accessible on different platforms/languages.

I want a big collection of APIs (stuff that can communicate with stuff outside).
Some that will be on most platforms/languages: file, date, UI.
Stuff that will be limited to just some languages: webGPU, memory management, shell/terminal.

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

## Settings 
Settings is a big part of this language. Some parts of the language might not be liked by everyone. This is why settings can be fun. You can access settings using `@:` and stop using it with`@;`.
Example:
```
hello : string = this need semi colon.;
log hello;

@:
semi_colon_at_end_of_line = false;
@;

hello : string = this need semi colon.
log hello
```
Keep in mind that everything in `@: @;` will use the default parser.

## Examples
```
hello := -3
hello = math( hello / |hello| )
// hello is -1
```

```
app : const = platform.createWindow
ui := app.ui

ui.append ui.create.box
```

```
// Simple voronoi script 
app : const = platform.createWindow
ui := app.ui

seedRan := new seedRandom
points : array = array.create.fill(100 /* 100 items */, (pos){return { x : func = { seedRan(pos*10)}, y : func = { seedRan(pos*10+1)} })

ui.forEveryPixel(x, y){
    closest : string :
    points.foreach(item){
        if item >= points[closest] then closest = item
    }
}
```

## More

You thought ; was needed, didn't you? Ummm...me too 😅. Semi colon will most probably be needed, but, I will try to make it like JavaScript. So it will automatically get injected. (This will be possible to disable, if you like ;)

The weird thing with this language being that (, {, [, ", and ' is the same. This makes it so that:
```
hello :func= "log('hello')";
hello;
```
Will log "log('hello')". Now that can be annoying, and probably not what you wanted. The fix for this being types:
```
hello : func = "log('hello': string :)";
hello;
```
Now needing to type `: string :` after every string can be teadios. So `"` and `'` will "prefer" being string. This will apply to `[]` too.
Example:
```
hello : func = log('wow');
hello;
// logs "wow". (as long wow is not defined)
```


## Specifications

### Types

`const` is used for values and types that can NOT be changed.

`var` is for values that can be changed but the type can not be changed.

`let` is for values and types that can be changed



