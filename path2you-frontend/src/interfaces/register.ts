import type Lecture from "./lecture";
import type User from "./user";

export default interface Register {
    id: number;
    attributes: {
        status: number;
        finished: boolean;
        lecture: {
            data: Lecture;
        };
        user: {
            data: User;
        };
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    };
}