import { Router } from 'express';
import { UserController } from '../controller/UserController';

const router = Router();
const userController = new UserController();


router.post('/login', userController.login);

router.all('/login', (req, res) => {
    res.status(405).json({ error: "Method Not Allowed" });
});

export default router;
