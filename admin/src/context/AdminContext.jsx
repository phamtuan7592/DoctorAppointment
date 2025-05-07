import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext()

const AdminContextProvider = (props) => {
    // Kiểm tra nếu aToken không có trong localStorage hoặc không hợp lệ
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '');
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (aToken) {
            getAllDoctors();
            getAllAppointments();
        }
    }, [aToken]);

    // Kiểm tra các request API và thông báo lỗi nếu có
    const getAllDoctors = async () => {
        if (!aToken) {
            toast.error('Token không hợp lệ hoặc không có');
            return;
        }

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/all-doctors`,
                {},
                { headers: { aToken } }
            );

            if (data.success) {
                setDoctors(data.doctors);
                console.log(data.doctors);  // Debug thông tin trả về
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi lấy dữ liệu bác sĩ.");
        }
    };

    const changeAvailability = async (docId) => {
        if (!aToken) {
            toast.error('Token không hợp lệ hoặc không có');
            return;
        }

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/change-availability`,
                { docId },
                { headers: { aToken } }
            );

            if (data.success) {
                toast.success(data.message);
                getAllDoctors();  // Cập nhật lại danh sách bác sĩ
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi thay đổi tình trạng.");
        }
    };

    const getAllAppointments = async () => {
        if (!aToken) {
            toast.error('Token không hợp lệ hoặc không có');
            return;
        }
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/admin/appointments`,
                { headers: { aToken } }
            );

            if (data.success) {
                setAppointments(data.appointments);
                console.log(data.appointments);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi lấy dữ liệu cuộc hẹn.");
        }
    };

    const value = {
        aToken,
        setAToken,
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        setAppointments,
        getAllAppointments
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
