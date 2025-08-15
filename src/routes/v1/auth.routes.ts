import {Router} from 'express';
import {login, register} from "../../controllers/authController.ts";
import {bodyValidation} from "../../middleware/validation.ts";
import {loginRequestDto, registerRequestDto} from "../../dto/auth.dto.ts";


const router = Router();


router.post('/login', bodyValidation(loginRequestDto), login)
router.post('/register', bodyValidation(registerRequestDto), register)

export default router;