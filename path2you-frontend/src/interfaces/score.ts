import type Exam from "./exam";

export default interface Score {
    id: number;
    attributes: {
        user: {
            data: {};
        };
        exam: {
            data: Exam;
        };
        score: number;
        approved: boolean;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    };
}