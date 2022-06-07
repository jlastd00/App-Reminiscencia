import { Schema, model } from "mongoose";

const sesionSchema = new Schema({
    titulo: { type: String, required: true },
    idPaciente: { type: String, required: true },
    hora_inicio: { type: String },
    hora_fin: { type: String },
    tareas: []
}, {
    versionKey: false
});

export default model('Sesion', sesionSchema);
