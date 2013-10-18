# Glue

Cleanly bonds together your content with behaviors.

## Usage

Glue crawls the DOM looking for elements with an attribute of `data-glue`, using it as the name of the module. From there, modules can be invoked with a constructor to add behaviors to that instance.

In it's most basic form:

```html
<div data-glue="hello-world"></div>
<script>
  glue("hello-world", function () {
    this.innerHTML = "Hello World";
  });
</script>
```

However, it might be useful to pass in instance-specific options as additional data attributes. To do so, simply create additional data attributes prefixed with `data-glue-` and they will be passed in with the `options` object provided to the constructor.

```html
<div data-glue="hello-world" data-glue-text="Hello World"></div>
<script>
  glue("hello-world", function (options) {
    this.innerHTML = options.text;
  });
</script>
```

Provided options will also try to be coerced into either `Object` or `Number` form. (Note that options passed in as JSON must be valid JSON, duh.)

```html
<div data-glue="carousel"
     data-glue-interval="3"
     data-glue-animations='{"start": "slideIn", "end": "slideOut"}'>
</div>
<script>
  glue("carousel", function (options) {
    createSlideshow(this, options.interval, options.animations);
  });
</script>
```

## Instantiating New Modules

New modules can be instantiated with previously specified constructors simply by invoking `glue` with the name of the module.

```html
<div data-glue="hello-world"></div>
<script>
  // instantiate existing modules
  glue("hello-world", function () {
    this.innerHTML = "Hello World";
  });

  var newModule = document.createElement("div");
  newModule.setAttribute("data-glue", "hello-world");

  document.body.appendChild(newModule);

  glue("hello-world"); // instantiates the new module
</script>
```

## License

Copyright (c) 2013 Ben Truyman

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
