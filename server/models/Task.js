import { Schema, model } from 'mongoose';

const taskSchema = new Schema({
    fecha_hora_inicio: { type: Date },
    fecha_hora_fin: { type: Date }
}, {
    versionKey: false
});

export default model('Task', taskSchema);
