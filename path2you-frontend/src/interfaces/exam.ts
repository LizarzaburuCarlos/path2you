import type Course from "./course";

export default interface Exam {
    id: number;
    attributes: {
        title: string;
        description: string;
        course: {
            data: Course;
        };
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    };
}