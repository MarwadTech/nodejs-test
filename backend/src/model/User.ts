export interface User {
    email: string;
    password?: string;
    status: 'active' | 'blocked' | 'unverified';
    verified: boolean;
}
