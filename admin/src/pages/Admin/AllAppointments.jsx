import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
//import assets from '../../assets'; // Đảm bảo bạn có `cancel_icon` trong assets
import { assets } from '../../assets/assets.js';


const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl mx-auto p-5">
      <p className="mb-4 text-2xl font-semibold text-gray-800">All Appointments</p>

      <div className="bg-white border rounded shadow text-sm max-h-[80vh] min-h-[60vh] overflow-y-auto">
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_2fr_3fr_1fr_1fr] items-center py-3 px-6 bg-gray-100 border-b font-medium text-gray-600">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[0.5fr_2fr_1fr_2fr_3fr_1fr_1fr] items-center py-3 px-6 border-b text-gray-700"
            >
              <p>{index + 1}</p>
              <p>{item.userData?.name || 'N/A'}</p>
              <p>{calculateAge(item.userData?.dob)}</p>
              <p>
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>
              <div className="flex items-center gap-2">
                <img className="w-8 h-8 rounded-full object-cover" src={item.docData?.image} alt="Doctor" />
                <p>{item.docData?.name}</p>
              </div>
              <p>
                {currency}
                {item.amount}
              </p>
              <div>
                {item.cancelled ? (
                  <p className="text-red-500 text-xs font-semibold">Cancelled</p>
                ) : item.isCompleted
                ?<p className='text-green-400 text-xs font-medium'>Completed</p> :(
                  <img
                    onClick={()=>cancelAppointment(item._id)}
                    className="w-6 cursor-pointer"
                    src={assets.cancel_icon}
                    alt="Cancel icon"
                    title="Cancel Appointment"
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-center text-gray-500">No appointments available</p>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;
