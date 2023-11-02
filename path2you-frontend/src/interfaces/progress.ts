import type Lesson from "./lesson";
import type User from "./user";

export default interface Progress {
    id: number;
    attributes: {
        finished: boolean;
        user: {
            data: User;
        };
        lesson: {
            data: Lesson;
        };
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    };
}