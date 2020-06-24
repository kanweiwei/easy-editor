declare const _default: {
    document: {
        nodes: {
            match: ({
                object: string;
                type?: undefined;
            } | {
                type: string;
                object?: undefined;
            })[];
        }[];
        last: {
            type: string;
        };
        normalize: (change: any, error: any) => any;
    };
    blocks: {
        paragraph: {
            nodes: {
                match: {
                    object: string;
                }[];
            }[];
        };
        object: {
            next: {
                match: string;
            }[];
            normalize: (change: any, error: any) => void;
        };
        embed: {
            next: {
                match: string;
            }[];
        };
        table: {
            nodes: {
                match: {
                    type: string;
                };
            }[];
            normalize: (change: any, error: any) => any;
        };
        "table-body": {
            nodes: {
                match: {
                    type: string;
                };
            }[];
            parent: {
                type: string;
            };
            normalize: (change: any, error: any) => any;
        };
        "table-row": {
            nodes: {
                match: {
                    type: string;
                };
            }[];
            normalize: (change: any, error: any) => any;
        };
        "table-cell": {
            nodes: {
                match: ({
                    type: string;
                    object?: undefined;
                } | {
                    object: string;
                    type?: undefined;
                })[];
            }[];
            normalize: (change: any, error: any) => any;
        };
    };
    inlines: {};
};
export default _default;
