import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import appointmentModel from '../models/appointmentModel.js';
import doctorModel from '../models/doctorModel.js';
import mongoose from 'mongoose';


// API to register user
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }
        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid email" });
        }
        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a strong password" });
        }

        // hasing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for user login
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: 'User dose not exist' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get user profile data

const getProfile = async (req, res) => {

    try {

        const userId = req.userId
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

//API to update user profile
const updateProfile = async (req, res) => {
    try {

        const userId = req.userId
        const { name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !address || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" });
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, {image: imageURL})

        }

        res.json({ success: true, message:"Profile Updated"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//api to book appontment
{/*const bookAppointment = async (req, res) => {
    try {
      const { docId, slotDate, slotTime } = req.body;
      const userId = req.userId;
  
      const docData = await doctorModel.findById(docId).select('-password');
  
      if (!docData.available) {
        return res.json({ success: false, message: 'Doctor not available' });
      }
  
      const alreadyBooked = await appointmentModel.findOne({
        docId,
        slotDate,
        slotTime
      });
  
      if (alreadyBooked) {
        return res.json({ success: false, message: 'Slot not available' });
      }
  
      let slots_booked = docData.slots_booked;
  
      if (slots_booked[slotDate]) {
        if (slots_booked[slotDate].includes(slotTime)) {
          return res.json({ success: false, message: 'Slot not available' });
        } else {
          slots_booked[slotDate].push(slotTime);
        }
      } else {
        slots_booked[slotDate] = [];
        slots_booked[slotDate].push(slotTime);
      }
  
      const userData = await userModel.findById(userId).select('-password');
      if (!userData) {
        return res.json({ success: false, message: 'User not found' });
      }
  
      delete docData.slots_booked;
  
      const appointmentData = {
        userId,
        docId,
        userData,
        docData,
        amount: docData.fees,
        slotTime,
        slotDate,
        date: Date.now(),
        payment: false,
        isCompleted: false
      };
  
      const newAppointment = new appointmentModel(appointmentData);
      await newAppointment.save();
  
      await doctorModel.findByIdAndUpdate(docId, { slots_booked });
  
      res.json({ success: true, message: 'Appointment Booked' });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };*/}
  // API to book appointment
const bookAppointment = async (req, res) => {
    try {
        const { docId, slotDate, slotTime } = req.body;
        const userId = req.userId;

        const docData = await doctorModel.findById(docId).select('-password');

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor not available' });
        }

        const alreadyBooked = await appointmentModel.findOne({
            docId,
            slotDate,
            slotTime,
            cancelled: false // Kiểm tra lịch chưa bị hủy
        });

        if (alreadyBooked) {
            return res.json({ success: false, message: 'Slot not available' });
        }

        let slots_booked = docData.slots_booked;

        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot not available' });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        }

        const userData = await userModel.findById(userId).select('-password');
        if (!userData) {
            return res.json({ success: false, message: 'User not found' });
        }

        delete docData.slots_booked;

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
            payment: false,
            isCompleted: false
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: 'Appointment Booked' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


//API listappoint
export const listAppointment = async (req, res) => {
    try {
        const userId = req.userId;  // Lấy userId từ token đã xác thực
        const appointments = await appointmentModel.find({ userId });

        if (appointments.length === 0) {
            return res.json({ success: false, message: "You have no appointments." });
        }

        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


//API cancel
{/*const cancelAppointment = async (req, res) => {
    try {
        const userId = req.userId;  // Sử dụng userId đã xác thực
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        if (appointmentData.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: 'Unauthorized action' });
        }

        // Cập nhật lịch hẹn thành "cancelled"
        appointmentData.cancelled = true;
        await appointmentData.save();

        const { docId, slotTime, slotDate } = appointmentData;
        const doctorData = await doctorModel.findById(docId);

        if (!doctorData) {
            return res.json({ success: false, message: 'Doctor not found' });
        }

        // Cập nhật lại slots_booked của bác sĩ
        let slots_booked = doctorData.slots_booked;
        if (slots_booked[slotDate]) {
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
            await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        }

        res.json({ success: true, message: 'Appointment Cancelled' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};*/}
// API cancel
const cancelAppointment = async (req, res) => {
    try {
        const userId = req.userId;  // Lấy userId từ token đã xác thực
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        if (appointmentData.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: 'Unauthorized action' });
        }

        // Cập nhật lịch hẹn thành "cancelled"
        appointmentData.cancelled = true;
        await appointmentData.save();

        const { docId, slotTime, slotDate } = appointmentData;
        const doctorData = await doctorModel.findById(docId);

        if (!doctorData) {
            return res.json({ success: false, message: 'Doctor not found' });
        }

        // Cập nhật lại slots_booked của bác sĩ
        let slots_booked = doctorData.slots_booked;
        if (slots_booked[slotDate]) {
            // Thêm lại slot đã bị hủy
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
            await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        }

        res.json({ success: true, message: 'Appointment Cancelled' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};



export { registerUser, loginUser, getProfile, updateProfile, bookAppointment,cancelAppointment}
