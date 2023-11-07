import type Course from "./course";

export default interface Question {
    id: number;
    attributes: {
        course: {
            data: Course;
        };
        title: string;
        firstQuestionAnswer:boolean;
        secondQuestionAnswer:boolean;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    };
}