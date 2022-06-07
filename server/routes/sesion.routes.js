import { Router } from 'express';
const router = Router();
import passport from 'passport';

import * as sesionsController from '../controllers/sesions.controller';

// Guardar inicio de sesion 
router.post('/sesion', passport.authenticate('jwt', {session: false}),  sesionsController.saveInitSesion);

// Guardar fin de sesion 
router.put('/sesion/:id', passport.authenticate('jwt', {session: false}),  sesionsController.saveEndSesion);

export default router;
