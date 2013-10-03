(function (win, undefined) {
  var PREFIX = "data-weld",
      R_ATTR_PREFIX = new RegExp("^" + PREFIX + "-"),
      R_BOOL = /^(true|false)$/;

  var weld = function (name, callback) {
    var attrs, key, node, settings,
        i = 0,
        nodes = findNodes(name);

    for (;node = nodes[i++];) {
      attrs = findAttributes(node);
      settings = {};

      for (key in attrs) {
        if (attrs.hasOwnProperty(key)) {
          settings[key] = parseAttr(attrs[key]);
        }
      }

      callback.call(node, settings);
    }
  };

  var findNodes = (function () {
    if (document.querySelectorAll !== undefined) {
      return function (name) {
        return toArray(document.querySelectorAll("[" + PREFIX + "=" + name + "]"));
      };
    } else {
      return function walk(name, root) {
        var child, i, nodes;

        if (root === undefined) {
          return walk(name, document.body);
        }

        nodes = [];

        for (i = 0; child = root.children[i++];) {
          if (child.nodeType === 1) {
            if (child.hasAttribute(PREFIX)) {
              nodes.push(child);
            }

            if (child.children.length > 0) {
              nodes = nodes.concat(walk(name, child));
            }
          }
        }

        return nodes;
      };
    }
  })();

  var findAttributes = function (node) {
    var attr, name,
        attrs = {},
        i = 0;

    for (;attr = node.attributes[i++];) {
      name = attr.name.split(R_ATTR_PREFIX)[1];

      if (name !== undefined) {
        attrs[name] = attr.nodeValue;
      }
    }

    return attrs;
  };

  var parseAttr = function (value) {
    // number
    if(/^\-?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) {
      return Number(value);
    }
    // boolean
    else if (value.match(R_BOOL)) {
      return (value === "true") ? true : false;
    }

    // json
    try {
      value = JSON.parse(value);
    } catch (e) {}

    // string
    return value;
  };

  var toArray = function (arrayLike) {
    return Array.prototype.slice.call(arrayLike);
  };

  win.weld = weld;
})(this);
