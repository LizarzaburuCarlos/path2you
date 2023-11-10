export default interface User {

    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    darkmode: boolean;
    neumorphismmode: boolean;
    name: string;
    createdAt: string;
    updatedAt: string;
}