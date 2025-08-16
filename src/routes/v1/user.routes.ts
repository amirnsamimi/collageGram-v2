import {Router} from 'express';
import {addUserAssets, getUsersById, patchUserById} from "../../controllers/userController.ts";
import {authenticateToken} from "../../middleware/auth.ts";

const router = Router();

router.use(authenticateToken)
router.get('/', getUsersById)
router.patch('/', patchUserById)
router.post('/assets', addUserAssets)

export default router;