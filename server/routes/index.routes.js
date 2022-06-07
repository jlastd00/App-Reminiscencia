import { Router } from 'express';
const router = Router();

import { homePage } from '../controllers/index.controller'

// Home page
router.get('/', homePage);

export default router;
