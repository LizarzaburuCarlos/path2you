import type Practice from "./practice";

export default interface Ask {
    id: number;
    attributes: {
        practice: {
            data: Practice;
        };
        title: string;
        true: boolean;
        false: boolean;
        trueSentence: string;
        falseSentence: string;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    };
}