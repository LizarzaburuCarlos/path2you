import type Lecture from "./lecture";

export default interface Lesson {
    id: number;
    attributes: {
        title: string;
        content: string;
        media: {
            data: {};
        };
        description: string;
        lecture: {
            data: Lecture;
        };
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    };
}