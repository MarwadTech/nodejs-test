import { UserController } from '../../src/controller/UserController';
import { AuthService } from '../../src/service/AuthService';
import { Request, Response } from 'express';

// Mock AuthService
jest.mock('../../src/service/AuthService');

describe('UserController', () => {
    let userController: UserController;
    let mockAuthService: any;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: any;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup mock response
        responseObject = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockImplementation((result) => {
                responseObject = result;
            })
        };

        // Setup mock AuthService
        mockAuthService = {
            login: jest.fn()
        };
        (AuthService as jest.Mock).mockImplementation(() => {
            return mockAuthService;
        });

        userController = new UserController();
    });

    describe('login', () => {
        it('should return 200 and result on success', async () => {
            mockRequest = {
                body: {
                    email: 'test@example.com',
                    password: 'password123'
                }
            };
            const mockResult = {
                message: 'Login successful',
                token: 'dummy-token'
            };
            mockAuthService.login.mockResolvedValue(mockResult);

            await userController.login(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
        });

        it('should return 400 for validation errors', async () => {
            mockRequest = {
                body: { email: '', password: '' }
            };
            mockAuthService.login.mockRejectedValue(new Error('Email required'));

            await userController.login(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Email required' });
        });

        it('should return 403 for blocked users', async () => {
            mockRequest = {
                body: { email: 'blocked@example.com', password: 'pass' }
            };
            mockAuthService.login.mockRejectedValue(new Error('User blocked / account disabled / suspended'));

            await userController.login(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User blocked / account disabled / suspended' });
        });

        it('should return 403 for unverified users', async () => {
            mockRequest = {
                body: { email: 'unverified@example.com', password: 'pass' }
            };
            mockAuthService.login.mockRejectedValue(new Error('User unverified / verify email / not verified'));

            await userController.login(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User unverified / verify email / not verified' });
        });

        it('should return 404 if user not found', async () => {
            mockRequest = {
                body: { email: 'notfound@example.com', password: 'pass' }
            };
            mockAuthService.login.mockRejectedValue(new Error('User not found'));

            await userController.login(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User not found' });
        });

        it('should return 500 for unexpected errors', async () => {
            mockRequest = {
                body: { email: 'test@example.com', password: 'pass' }
            };
            mockAuthService.login.mockRejectedValue(new Error('Database error'));

            await userController.login(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Database error' });
        });
    });
});
