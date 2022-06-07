import { Schema, model } from 'mongoose';

const interactionSchema = new Schema({
    idSesion: { type: String, required: true },
    elemento_interactuado: { type: String, required: true },
    fecha_hora: { type: Date, required: true }
}, {
    versionKey: false
});

export default model('Interaction', interactionSchema);
