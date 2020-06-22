import { Value } from "@zykj/slate";

const initValue = () => {
  return Value.fromJSON({
    document: {
      nodes: [
        {
          object: "block",
          type: "div",
          nodes: [
            {
              object: "text",
              leaves: [
                {
                  text: "\u200B",
                  marks: [],
                },
              ],
            },
          ],
        },
      ],
    },
  });
};

export default initValue;
