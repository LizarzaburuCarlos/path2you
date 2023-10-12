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
    created_at: string;
    updated_at: string;
}