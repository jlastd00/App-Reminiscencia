import { Schema, model } from "mongoose";

const videoSchema = new Schema({
    titulo: { type: String, required: true },
    duracion: { type: String, required: true },
    etiquetas: { type: String, required: true },
    url: { type: String, required: true }
}, {
    versionKey: false
})

export default model('Video', videoSchema);
