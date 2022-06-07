import Patient from "../models/Patient";

// Obtener datos paciente
export async function getDataPatient(req, res) {
    
    const patientID = req.params.id;
    
    const patient = await Patient.findById({_id: patientID});
    if (!patient) return res.json({success: false, msg: 'Patient does not exists'});
    
    return res.json({patient: patient});
}
