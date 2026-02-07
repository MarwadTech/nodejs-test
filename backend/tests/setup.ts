// In tests/setup.ts
export const testUsers = [
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
    }
];
