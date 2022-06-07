import Video from "../models/Video";

export async function getTaskObjetos(req, res) {

    return res.json({success: true, msg: 'Tarea tipo "Objetos cotidianos"'});
}

export async function getTaskCanciones(req, res) {

    return res.json({success: true, msg: 'Tarea tipo "Canción"'});
}

export async function getTaskVideos(req, res) {

    const videos = await Video.find();
    if (!videos) return res.json({success: false, msg: 'No se han podido cargar los videos'});

    return res.json({videos: videos});

}
