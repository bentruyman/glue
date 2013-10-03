/* global afterEach, describe, expect, it, weld */
(function () {
  var sandbox = document.getElementById("sandbox");

  afterEach(function () {
    sandbox.innerHTML = "";
  });

  describe("Instantiation", function () {
    it("should instantiate a named module based on a default data attribute", function (done) {
      var container = document.createElement("div");
      container.setAttribute("data-weld", "widget");

      sandbox.appendChild(container);

      weld("widget", function () {
        expect(this).to.be(container);
        done();
      });
    });
  });

  describe("Options", function () {
    it("should provide pass a set of options to the constructor based on markup attributes", function (done) {
      sandbox.innerHTML = "<div data-weld='widget' data-weld-foo='bar' data-weld-baz='qux'></div>";

      weld("widget", function (options) {
        expect(options.foo).to.eql("bar");
        expect(options.baz).to.eql("qux");
        done();
      });
    });

    it("should convert numeric options", function (done) {
      sandbox.innerHTML = ["<div data-weld='widget'" +
                                "data-weld-opt1='0'" +
                                "data-weld-opt2='10'" +
                                "data-weld-opt3='3.14159'" +
                                "data-weld-opt4='-9000'" +
                           "</div>"
                          ].join(" ");

      weld("widget", function (options) {
        expect(options.opt1).to.be(0);
        expect(options.opt2).to.be(10);
        expect(options.opt3).to.be(3.14159);
        expect(options.opt4).to.be(-9000);
        done();
      });
    });

    it("should convert \"JSON\" options", function (done) {
      sandbox.innerHTML = ["<div data-weld='widget'" +
                                "data-weld-obj1='{ \"foo\": \"bar\" }'" +
                           "</div>"
                          ].join(" ");

      weld("widget", function (options) {
        expect(options.obj1).to.eql({ foo: "bar" });
        done();
      });
    });
  });
})();
