import type Course from "./course";

export default interface Exam {
    id: number;
    attributes: {
        title: string;
        description: string;
        course: {
            data: Course;
        };
        slug: string;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    };
}