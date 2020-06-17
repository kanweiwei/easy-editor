declare const _default: {
    document: {
        nodes: {
            match: {
                type: any;
            }[];
        }[];
        normalize: (change: any, error: any) => any;
    };
    blocks: {
        "paper-description": {
            parent: {
                object: string;
            };
            normalize: (change: any, error: any) => any;
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
    inlines: {
        image: {
            isVoid: boolean;
        };
    };
};
export default _default;
