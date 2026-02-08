import { UserRepo } from '../../src/repo/UserRepo';

describe('UserRepo', () => {
    let userRepo: UserRepo;

    beforeEach(() => {
        userRepo = new UserRepo();
    });

    describe('findByEmail', () => {
        it('should return user if email exists', async () => {
            const email = 'active@example.com';
            const user = await userRepo.findByEmail(email);

            expect(user).toBeDefined();
            expect(user?.email).toBe(email);
            expect(user?.status).toBe('active');
        });

        it('should return null if email does not exist', async () => {
            const email = 'nonexistent@example.com';
            const user = await userRepo.findByEmail(email);

            expect(user).toBeNull();
        });

        it('should return blocked user correctly', async () => {
            const email = 'blocked@example.com';
            const user = await userRepo.findByEmail(email);

            expect(user).toBeDefined();
            expect(user?.status).toBe('blocked');
        });

        it('should return unverified user correctly', async () => {
            const email = 'unverified@example.com';
            const user = await userRepo.findByEmail(email);

            expect(user).toBeDefined();
            expect(user?.verified).toBe(false);
        });
    });
});
