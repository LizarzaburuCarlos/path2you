import type Module from "./module";
import type User from "./user";

export default interface Register {
    id: number;
    attributes: {
        status: number;
        finished: boolean;
        module: {
            data: Module;
        };
        user: {
            data: User;
        };
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    };
}