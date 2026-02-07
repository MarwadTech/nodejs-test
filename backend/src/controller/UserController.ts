import { Request, Response } from 'express';
import { AuthService } from '../service/AuthService';

export class UserController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.status(200).json(result);
        } catch (error: any) {
            const msg = error.message || "An error occurred";

            // Map validation errors to 400
            if (msg.match(/required|empty|invalid|short|long|whitespace/i)) {
                res.status(400).json({ error: msg });
                return;
            }

            // Map Forbidden errors
            if (msg.match(/blocked|disabled|suspended|unverified|verify/i)) {
                res.status(403).json({ error: msg });
                return;
            }

            // Map Not Found (optional, or treat as 400/401 for security)
            if (msg === "User not found") {
                res.status(404).json({ error: "User not found" });
                return;
            }

            // Default
            res.status(500).json({ error: msg });
        }
    }
}
