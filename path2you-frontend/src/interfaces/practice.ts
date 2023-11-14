import type Module from "./module";

export default interface Practice {
    id: number;
    attributes: {
        title: string;
        module: {
            data: Module;
        };
        description: string;
        slug: string;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    };
}