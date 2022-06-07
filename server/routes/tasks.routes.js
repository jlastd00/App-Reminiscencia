import { Router } from 'express';
const router = Router();
import passport from 'passport';

import * as tasksController from '../controllers/tasks.controller';

// Obtener tareas de tipo objetos cotidianos
router.get('/objetos', tasksController.getTaskObjetos);

// Obtener tareas de tipo canciones
router.get('/canciones', tasksController.getTaskCanciones);

// Obtener tareas de tipo videos
router.get('/videos', passport.authenticate('jwt', {session: false}), tasksController.getTaskVideos);

export default router;
