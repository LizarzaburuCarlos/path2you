import type Course from "./course";

export default interface Inscription {
    id: number;
    attributes: {
        date: Date;
        user: {
            data: {};
        };
        course: {
            data: Course;
        };
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    };
}