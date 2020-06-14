import _mapInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/map";

var _context;

import { __assign } from "tslib";
/* eslint-disable no-console */

import { message } from "antd";
import { Block } from "@zykj/slate";
import * as violations from "@zykj/slate-schema-violations";
export default {
  document: {
    nodes: [{
      match: _mapInstanceProperty(_context = ["div", "table", "paragraph"]).call(_context, function (item) {
        return {
          type: item
        };
      })
    }],
    normalize: function normalize(change, error) {
      console.dir(error);

      try {
        switch (error.code) {
          case violations.CHILD_TYPE_INVALID:
            change = change.replaceNodeByKey(error.child.key, new Block(__assign(__assign({}, error.child), {
              nodes: error.child.nodes,
              object: "block",
              key: error.child.key,
              type: "div"
            })));
            return change;

          default:
            return null;
        }
      } catch (err) {
        console.log(err);
        message.error(err.message);
      }

      return change;
    }
  },
  blocks: {
    "paper-description": {
      parent: {
        object: "document"
      },
      normalize: function normalize(change, error) {
        console.dir(error);

        try {
          switch (error.code) {
            case violations.PARENT_OBJECT_INVALID:
              change = change.unwrapNodeByKey(error.parent.key);
              return change;

            default:
              return null;
          }
        } catch (err) {
          console.log(err);
          message.error(err.message);
        }

        return change;
      }
    },
    table: {
      nodes: [{
        match: {
          type: "table-body"
        }
      }],
      normalize: function normalize(change, error) {
        console.dir(error);

        try {
          switch (error.code) {
            case violations.CHILD_TYPE_INVALID:
              change = change.wrapBlockByKey(error.child.key, "table-body");
              return change;

            default:
              return null;
          }
        } catch (err) {
          console.log(err);
          message.error(err.message);
        }

        return change;
      }
    },
    "table-body": {
      nodes: [{
        match: {
          type: "table-row"
        }
      }],
      parent: {
        type: "table"
      },
      normalize: function normalize(change, error) {
        console.dir(error);

        try {
          switch (error.code) {
            case violations.CHILD_TYPE_INVALID:
              change = change.wrapBlockByKey(error.child.key, "table-row");
              return change;

            case violations.PARENT_TYPE_INVALID:
              change = change.wrapBlockByKey(error.node.key, {
                type: "table",
                data: {
                  border: 1
                }
              });
              return change;

            default:
              return null;
          }
        } catch (err) {
          console.log(err);
          message.error(err.message);
        }

        return change;
      }
    },
    "table-row": {
      nodes: [{
        match: {
          type: "table-cell"
        }
      }],
      normalize: function normalize(change, error) {
        console.dir(error);

        try {
          switch (error.code) {
            case violations.CHILD_TYPE_INVALID:
              change = change.wrapBlockByKey(error.child.key, "table-cell");
              return change;

            default:
              return null;
          }
        } catch (err) {
          console.log(err);
          message.error(err.message);
        }

        return change;
      }
    },
    "table-cell": {
      nodes: [{
        match: [{
          type: "paragraph"
        }, {
          type: "table"
        }, {
          type: "span"
        }, {
          type: "div"
        }, {
          object: "text"
        }, {
          object: "inline"
        }]
      }],
      normalize: function normalize(change, error) {
        console.log(error.code, error.child, error.child.text);

        try {
          switch (error.code) {
            case violations.CHILD_TYPE_INVALID:
            case violations.CHILD_OBJECT_INVALID:
              change = change.wrapBlockByKey(error.child.key, "div");
              return change;

            default:
              return null;
          }
        } catch (err) {
          console.log(err);
          message.error(err.message);
        }

        return change;
      }
    }
  },
  inlines: {
    image: {
      isVoid: true
    }
  }
};