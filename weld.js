(function (window, undefined) {
  var
    // aliases
    document = window.document,
    // constants
    PREFIX = "data-weld",
    R_ATTR_PREFIX = new RegExp("^" + PREFIX + "-"),
    R_BOOL = /^(true|false)$/,
    // state
    callbacks = {},
    invokedNodes = [],

  weld = function (name, callback) {
    if (callback !== undefined) {
      callbacks[name] = callback;
    }

    if (callbacks[name] !== undefined) {
      invokeNodes(findNodes(name), callbacks[name]);
    }
  },

  findNodes = (function () {
    var find;

    if (document.querySelectorAll !== undefined) {
      find = function (name) {
        return toArray(document.querySelectorAll("[" + PREFIX + "=" + name + "]"));
      };
    } else {
      find = function walk(name, root) {
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

    return function (name) {
      var k, invokedNode, node,
          i = 0,
          nodes = find(name),
          uninvokedNodes = [];

      outer: for (;node = nodes[i++];) {
        inner: for (k = 0;invokedNode = invokedNodes[k++];) {
          if (invokedNode === node) {
            continue outer;
          }
        }

        uninvokedNodes.push(node);
      }

      return uninvokedNodes;
    };
  })(),

  findAttributes = function (node) {
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
  },

  invokeNodes = function (nodes, callback) {
    var node,
        i = 0;

    for (;node = nodes[i++];) {
      invokeNode(node, callback);
    }
  },

  invokeNode = function (node, callback) {
    var attrs = findAttributes(node),
        settings = {},
        key;

    for (key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        settings[key] = parseAttr(attrs[key]);
      }
    }

    callback.call(node, settings);
    invokedNodes.push(node);
  },

  parseAttr = function (value) {
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
  },

  toArray = function (arrayLike) {
    return Array.prototype.slice.call(arrayLike);
  };

  weld.reset = function () {
    callbacks = {};
    invokedNodes = [];
  };

  window.weld = weld;
})(this);
