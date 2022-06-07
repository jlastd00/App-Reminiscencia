import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import passport from "passport";
import path from 'path';

import { PORT } from './config/properties';
import './config/database';

import indexRoutes from './routes/index.routes';
import usersRoutes from './routes/users.routes';
import tasksRoutes from './routes/tasks.routes';
import patientsRoutes from './routes/patients.routes';
import sesionsRoutes from './routes/sesion.routes';

// Initializations
const app = express();

// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRoutes);
app.use('/users', usersRoutes);
app.use('/tasks', tasksRoutes);
app.use('/patients', patientsRoutes);
app.use('/sesions', sesionsRoutes);
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Server running
app.listen(PORT);
console.log('Server running on http://localhost:', PORT);
