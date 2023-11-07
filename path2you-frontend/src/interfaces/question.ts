import type Exam from "./exam";

export default interface Question {
    id: number;
    attributes: {
        exam: {
            data: Exam;
        };
        title: string;
        true:boolean;
        false:boolean;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    };
}