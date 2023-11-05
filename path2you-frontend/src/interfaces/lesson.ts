import type Module from "./module";

export default interface Lesson {
    id: number;
    attributes: {
        title: string;
        content: string;
        media: {
            data: {};
        };
        description: string;
        module: {
            data: Module;
        };
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    };
}