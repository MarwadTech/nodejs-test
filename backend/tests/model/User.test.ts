import { User } from '../../src/model/User';

describe('User Model', () => {
    it('should be able to create a valid user object', () => {
        const user: User = {
            email: 'test@example.com',
            password: 'password123',
            status: 'active',
            verified: true
        };

        expect(user).toBeDefined();
        expect(user.email).toBe('test@example.com');
        expect(user.status).toBe('active');
        expect(user.verified).toBe(true);
    });

    it('should allow optional password', () => {
        const user: User = {
            email: 'auth@example.com',
            status: 'active',
            verified: false
        };

        expect(user).toBeDefined();
        expect(user.password).toBeUndefined();
    });
});
