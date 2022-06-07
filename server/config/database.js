import mongoose from 'mongoose';
import { DB } from './properties';

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(db => console.log('Connected to', DB))
    .catch(err => console.error(err));
