import {Router} from 'express';
import {register} from "../../controllers/authController.js";
import {bodyValidation} from "../../middleware/validation.js";
import {insertUserSchema } from "../../db/schema.js";

const router = Router();


router.post('/login', bodyValidation(insertUserSchema), (req, res) => {

})

router.post('/register', register)

export default router;