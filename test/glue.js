/* global afterEach, describe, expect, it, glue */
(function () {
  var sandbox = document.getElementById("sandbox");

  afterEach(function () {
    sandbox.innerHTML = "";
    glue.reset();
  });

  describe("Instantiation", function () {
    it("should instantiate a named module based on a default data attribute", function () {
      var that,
          container = document.createElement("div");

      container.setAttribute("data-glue", "widget");

      sandbox.appendChild(container);

      glue("widget", function () {
        that = this;
      });

      expect(that).toBe(container);
    });

    it("can reinstantiate new modules", function () {
      var els = [],
          container1 = document.createElement("div"),
          container2 = document.createElement("div");

      container1.setAttribute("data-glue", "widget");
      container2.setAttribute("data-glue", "widget");

      sandbox.appendChild(container1);

      glue("widget", function () {
        els.push(this);
      });

      expect(els).toEqual([container1]);

      sandbox.appendChild(container2);

      glue("widget");

      expect(els).toEqual([container1, container2]);
    });

    it("doesn't invoke modules until a factory is defined", function () {
      var els = [],
          container1 = document.createElement("div"),
          container2 = document.createElement("div");

      container1.setAttribute("data-glue", "widget");
      container2.setAttribute("data-glue", "widget");

      sandbox.appendChild(container1);

      glue("widget");

      sandbox.appendChild(container2);

      glue("widget", function () {
        els.push(this);
      });

      expect(els).toEqual([container1, container2]);
    });

    it("should allow a module's factory to be overwritten", function () {
      var results = [],
          container1 = document.createElement("div"),
          container2 = document.createElement("div");

      container1.setAttribute("data-glue", "widget");
      container2.setAttribute("data-glue", "widget");

      sandbox.appendChild(container1);

      glue("widget", function () {
        results.push("foo");
      });

      sandbox.appendChild(container2);

      glue("widget", function () {
        results.push("bar");
      });

      expect(results).toEqual(["foo", "bar"]);
    });
  });

  describe("Configuration", function () {
    it("allows the data attribute prefix to be defined", function () {
      var opts;

      glue({ prefix: "prefix" });

      sandbox.innerHTML = "<div data-prefix='widget' data-prefix-foo='bar' data-prefix-baz='qux'></div>";

      glue("widget", function (options) {
        opts = options;
      });

      expect(opts.foo).toEqual("bar");
      expect(opts.baz).toEqual("qux");
    });
  });

  describe("Options", function () {
    it("should provide pass a set of options to the module's factory based on markup attributes", function () {
      var opts;

      sandbox.innerHTML = "<div data-glue='widget' data-glue-foo='bar' data-glue-baz='qux'></div>";

      glue("widget", function (options) {
        opts = options;
      });

      expect(opts.foo).toEqual("bar");
      expect(opts.baz).toEqual("qux");
    });

    it("should convert numeric options", function () {
      var opts;

      sandbox.innerHTML = [
        "<div data-glue='widget'" +
             "data-glue-opt1='0'" +
             "data-glue-opt2='10'" +
             "data-glue-opt3='3.14159'" +
             "data-glue-opt4='-9000'" +
             "data-glue-opt5='Infinity'" +
        "</div>"
      ].join(" ");

      glue("widget", function (options) {
        opts = options;
      });

      expect(opts.opt1).toBe(0);
      expect(opts.opt2).toBe(10);
      expect(opts.opt3).toBe(3.14159);
      expect(opts.opt4).toBe(-9000);
      expect(opts.opt5).toBe(Infinity);
    });

    it("should convert \"JSON\" options", function () {
      var opts;

      sandbox.innerHTML = [
        "<div data-glue='widget'" +
             "data-glue-obj1='{ \"foo\": \"bar\" }'" +
        "</div>"
      ].join(" ");

      glue("widget", function (options) {
        opts = options;
      });

      expect(opts.obj1).toEqual({ foo: "bar" });
    });
  });
})();
