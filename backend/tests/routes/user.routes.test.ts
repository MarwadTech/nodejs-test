import request from 'supertest';
import express from 'express';

// Define the mock login function outside to use it in the factory
const mockLogin = jest.fn((req, res) => {
    res.status(200).json({ message: 'Mock Login Success' });
});

// Mock the Controller Class using the factory parameter to ensure it returns the instance shape we want
jest.mock('../../src/controller/UserController', () => {
    return {
        UserController: jest.fn().mockImplementation(() => {
            return {
                login: mockLogin
            };
        })
    };
});

// Import routes AFTER the mock is defined (standard import is fine because jest.mock is hoisted)
// However, since we used the factory, strict order is maintained.
import userRoutes from '../../src/routes/user.routes';

describe('User Routes', () => {
    let app: express.Application;

    beforeEach(() => {
        // Clear mock data but keep implementation
        mockLogin.mockClear();

        app = express();
        app.use(express.json());
        app.use('/api', userRoutes);
    });

    it('POST /api/login should call UserController.login', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({ email: 'test', password: 'test' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Mock Login Success');
        expect(mockLogin).toHaveBeenCalled();
    });

    it('GET /api/login should return 405 Method Not Allowed', async () => {
        const response = await request(app).get('/api/login');
        expect(response.status).toBe(405);
        expect(response.body.error).toBe("Method Not Allowed");
    });
});
