import Sesion from "../models/Sesion";

export async function saveInitSesion(req, res) {

    const sesion = req.body;
    
    const newSesion = new Sesion({
        titulo: sesion.titulo,
        idPaciente: sesion.idPaciente,
        hora_inicio: sesion.hora_inicio,
        hora_fin: sesion.hora_fin,
        tareas: []
    })

    const savedSesion = await newSesion.save();
    if (!savedSesion) return res.json({success: false, msg: 'Algo ha ido mal'});

    return res.json({
        success: true,
        msg: 'Sesion guardada',
        sesion: savedSesion
    });
}

export async function saveEndSesion(req, res) {

    const idSession = req.params.id;
    const dataSesion = req.body;

    const updatedSesion = await Sesion.findByIdAndUpdate(idSession, { hora_fin: dataSesion.hora_fin, tareas: dataSesion.tareas });
    if (!updatedSesion) return res.json({success: false, msg: 'Algo ha ido mal'});

    return res.json({
        success: true,
        msg: 'Sesion guardada',
        sesion: updatedSesion
    });
}
