/* eslint-disable no-console */
import { message } from "antd";

import { Block } from "@zykj/slate";
import * as violations from "@zykj/slate-schema-violations";

export default {
  document: {
    nodes: [
      {
        match: ["div", "table", "paragraph"].map((item: any) => {
          return {
            type: item,
          };
        }),
      },
    ],
    normalize: (change: any, error: any) => {
      console.dir(error);
      try {
        switch (error.code) {
          case violations.CHILD_TYPE_INVALID:
            change = change.replaceNodeByKey(
              error.child.key,
              new Block({
                ...error.child,
                nodes: error.child.nodes,
                object: "block",
                key: error.child.key,
                type: "div",
              })
            );
            return change;
          default:
            return null;
        }
      } catch (err) {
        console.log(err);
        message.error(err.message);
      }
      return change;
    },
  },
  blocks: {
    "paper-description": {
      parent: {
        object: "document",
      },
      normalize: (change: any, error: any) => {
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
      },
    },

    table: {
      nodes: [
        {
          match: { type: "table-body" },
        },
      ],
      normalize: (change: any, error: any) => {
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
      },
    },
    "table-body": {
      nodes: [
        {
          match: { type: "table-row" },
        },
      ],
      parent: {
        type: "table",
      },
      normalize: (change: any, error: any) => {
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
                  border: 1,
                },
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
      },
    },

    "table-row": {
      nodes: [
        {
          match: { type: "table-cell" },
        },
      ],
      normalize: (change: any, error: any) => {
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
      },
    },
    "table-cell": {
      nodes: [
        {
          match: [
            {
              type: "paragraph",
            },
            {
              type: "table",
            },
            {
              type: "span",
            },
            { type: "div" },
            { object: "text" },
            { object: "inline" },
          ],
        },
      ],
      normalize: (change: any, error: any) => {
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
      },
    },
  },
  inlines: {
    image: {
      isVoid: true,
    },
  },
};
