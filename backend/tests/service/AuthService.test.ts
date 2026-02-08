import { AuthService } from '../../src/service/AuthService';
import { UserRepo } from '../../src/repo/UserRepo';

// Mock the UserRepo module
jest.mock('../../src/repo/UserRepo');

describe('AuthService', () => {
    let authService: AuthService;
    let mockFindByEmail: jest.Mock;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Setup the mock implementation for findByEmail
        mockFindByEmail = jest.fn();
        (UserRepo as jest.Mock).mockImplementation(() => {
            return {
                findByEmail: mockFindByEmail
            };
        });

        authService = new AuthService();
    });

    describe('login', () => {
        // ============================================
        // Email Validation Tests
        // ============================================
        it('should throw error if email is missing', async () => {
            await expect(authService.login(undefined, 'password')).rejects.toThrow('Email required');
            await expect(authService.login(null, 'password')).rejects.toThrow('Email required');
            await expect(authService.login('', 'password')).rejects.toThrow('Email required');
        });

        it('should throw error if email is not a string', async () => {
            await expect(authService.login(123, 'password')).rejects.toThrow('Email invalid type');
        });

        it('should throw error if email is empty whitespace', async () => {
            await expect(authService.login('   ', 'password')).rejects.toThrow('Email invalid (empty/whitespace)');
        });

        it('should throw error for invalid email format', async () => {
            await expect(authService.login('invalid-email', 'password')).rejects.toThrow('Email invalid format');
        });

        it('should throw error if email is too long', async () => {
            const longEmail = 'a'.repeat(255) + '@example.com';
            await expect(authService.login(longEmail, 'password')).rejects.toThrow('Email too long');
        });

        it('should throw error for specific invalid characters', async () => {
            await expect(authService.login('test<script>@example.com', 'password')).rejects.toThrow('Email invalid characters');
        });

        // ============================================
        // Password Validation Tests
        // ============================================
        it('should throw error if password is missing', async () => {
            await expect(authService.login('test@example.com', undefined)).rejects.toThrow('Password required');
        });

        it('should throw error if password is not a string', async () => {
            await expect(authService.login('test@example.com', 12345)).rejects.toThrow('Password invalid type');
        });

        it('should throw error if password is empty whitespace', async () => {
            await expect(authService.login('test@example.com', '   ')).rejects.toThrow('Password invalid (whitespace)');
        });

        it('should throw error if password is too short', async () => {
            await expect(authService.login('test@example.com', '12345')).rejects.toThrow('Password too short minimum 6');
        });

        it('should throw error if password is too long', async () => {
            const longPassword = 'a'.repeat(129);
            await expect(authService.login('test@example.com', longPassword)).rejects.toThrow('Password too long maximum 128');
        });

        // ============================================
        // User Lookup & Status Tests
        // ============================================
        it('should throw error if user not found', async () => {
            mockFindByEmail.mockResolvedValue(null);
            await expect(authService.login('notfound@example.com', 'password123')).rejects.toThrow('User not found');
            expect(mockFindByEmail).toHaveBeenCalledWith('notfound@example.com');
        });

        it('should throw error if user is blocked', async () => {
            mockFindByEmail.mockResolvedValue({
                email: 'blocked@example.com',
                status: 'blocked',
                verified: true
            });
            await expect(authService.login('blocked@example.com', 'password123')).rejects.toThrow('User blocked / account disabled / suspended');
        });

        it('should throw error if user is unverified', async () => {
            mockFindByEmail.mockResolvedValue({
                email: 'unverified@example.com',
                status: 'active',
                verified: false
            });
            await expect(authService.login('unverified@example.com', 'password123')).rejects.toThrow('User unverified / verify email / not verified');
        });

        it('should login successfully with valid credentials', async () => {
            const mockUser = {
                email: 'test@example.com',
                status: 'active',
                verified: true
            };
            mockFindByEmail.mockResolvedValue(mockUser);

            const result = await authService.login('test@example.com', 'password123');

            expect(result).toHaveProperty('token');
            expect(result.message).toBe('Login successful');
            expect(result.user.email).toBe('test@example.com');
        });
    });
});
