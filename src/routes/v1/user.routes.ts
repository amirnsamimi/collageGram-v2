import {Router} from 'express';
import {getAllUsers, getUsersByUserName} from "../../controllers/userController.ts";
import {authenticateToken} from "../../middleware/auth.ts";

const router = Router();

router.get('/', authenticateToken, getAllUsers)

router.get('/:id', authenticateToken, getUsersByUserName)

export default router;