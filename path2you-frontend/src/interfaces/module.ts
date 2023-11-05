export default interface Module {
    id: number;
    attributes: {
        title: string;
        description: string;
        slug: string;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    };
}