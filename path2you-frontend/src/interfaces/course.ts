export default interface Course {
    id: number;
    attributes: {
        title: string;
        description: string;
        slug: string;
        duration: number;
        photo: {
            data: {};
        };
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    };
}