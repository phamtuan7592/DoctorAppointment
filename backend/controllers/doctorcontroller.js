import doctorModel from "../models/doctorModel.js"
import appointmentModel from "../models/appointmentModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const changeAvailablity = async (req, res) => {
    try {

      
        const docId = req.body.docId

        const docData = await doctorModel.findById(docId)
        if (!docData) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])

        res.json({ success: true, doctors })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
//API for doctor Login
const loginDoctor = async (req, res) => {
    try {

        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {

            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
//API to get doctr appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {

        const docId = req.docId

        if (!docId) {
            return res.status(400).json({ success: false, message: 'Missing doctor ID' });
        }

        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//API to mark  appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const docId = req.docId
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId.toString() === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: "Appointment Complete" })
        } else {
            return res.json({ success: false, message: "Mark Failed" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//API to cancel appointment  for doctor panel
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const docId = req.docId
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId.toString() === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: "Appointment Cancelled" })
        } else {
            return res.json({ success: false, message: "Cancellation Failed" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//API to get dashboard data for doctor
const doctorDashboard = async (req, res) => {
    try {

        const docId = req.docId

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []
        appointments.forEach((item) => {
            const id = item.userId.toString()
            if (!patients.includes(id)) {
                patients.push(id)
            }
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5)

        }
        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//API to get doctor profilr for doctor
const doctorProfile = async(req,res)=>{
    try{
        const docId = req.docId
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({success:true, profileData})

    }catch(error){
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//API to update profiile
const updateDoctorProfile = async (req,res)=>{
    try{
        const{fees,address, available}= req.body
        const docId = req.docId

        await doctorModel.findByIdAndUpdate(docId,{fees, address, available})

        res.json({success:true,message:'Profile Updated'})
    }catch(error){
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { changeAvailablity,
     doctorList, 
     loginDoctor, 
     appointmentsDoctor, 
     appointmentComplete, 
     appointmentCancel, 
     doctorDashboard,
     doctorProfile,
     updateDoctorProfile
 }