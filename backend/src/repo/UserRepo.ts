import { User } from '../model/User';

// Mock database
const users: User[] = [
    {
        email: 'active@example.com',
        password: 'hashedPassword',
        status: 'active',
        verified: true
    },
    {
        email: 'blocked@example.com',
        password: 'hashedPassword',
        status: 'blocked',
        verified: true
    },
    {
        email: 'unverified@example.com',
        password: 'hashedPassword',
        status: 'active',
        verified: false
    },
    {
        email: 'admin@example.com',
        password: 'hashedPassword',
        status: 'active',
        verified: true
    }
];

export class UserRepo {
    async findByEmail(email: string): Promise<User | null> {
        const user = users.find(u => u.email === email);
        return user || null;
    }
}
