import { Router } from 'express';
const router = Router();
import passport from 'passport';

import * as patientsController from '../controllers/patients.controller';

// Obtener todos los pacientes de un usuario
router.get('/patient/:id', passport.authenticate('jwt', {session: false}),  patientsController.getDataPatient);

export default router;
