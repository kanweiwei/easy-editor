import { Block } from "@zykj/slate";
import * as violations from "@zykj/slate-schema-violations";

export default {
  document: {
    nodes: [
      {
        match: {
          object: "block",
        },
      },
    ],
    last: {
      type: "paragraph",
    },
    normalize: (change: any, error: any) => {
      try {
        switch (error.code) {
          case violations.CHILD_TYPE_INVALID:
            change = change.replaceNodeByKey(
              error.child.key,
              Block.create({
                ...error.child,
                nodes: error.child.nodes,
                object: "block",
                key: error.child.key,
                type: "div",
              })
            );
            return change;
          case violations.LAST_CHILD_TYPE_INVALID:
            let document = change.value.document;
            change.insertNodeByKey(
              document.key,
              document.nodes.size,
              Block.create({
                type: "paragraph",
              })
            );
            return change;
          default:
            return null;
        }
      } catch (err) {
        console.log(err);
      }
      return change;
    },
  },
  blocks: {
    paragraph: {
      nodes: [
        {
          match: [
            {
              object: "block",
            },

            {
              object: "inline",
            },
            {
              object: "text",
            },
          ],
        },
      ],
    },
    object: {
      next: [
        {
          match: "paragraph",
        },
      ],
      normalize: (change: any, error: any) => {
        console.log(error);
      },
    },
    embed: {
      next: [
        {
          match: "paragraph",
        },
      ],
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
