export default interface Lecture {
    id: number;
    attributes: {
        title: string;
        description: string;
        media: {
            data: {};
        };
        slug: string;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    };
}