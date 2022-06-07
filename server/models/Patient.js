import { Schema, model } from "mongoose";

const patientSchema = new Schema({
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    sexo: { type: String, required: true },
    fechaNac: { type: Date, required: true },
    lugarNac: { type: String, required: true },
    nivelDemencia: { type: Number, required: true }
}, {
    versionKey: false
});

export default model('Patient', patientSchema);
