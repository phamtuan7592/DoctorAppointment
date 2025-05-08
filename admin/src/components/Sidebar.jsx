import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'

export const Sidebar = () => {
    const { aToken } = useContext(AdminContext)
    const { dToken } = useContext(DoctorContext)

    return (
        <div>
            <div className='min-h-screen bg-white border-r'>
                {aToken && (
                    <ul className='text-[#515151] mt-5'>
                        {/* Dashboard link */}
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    `flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                                    }`
                                }
                                to={'/admin-dashboard'}
                            >
                                <img src={assets.home_icon} alt="Dashboard" />
                                <p className='hidden md:block'>Dashboard</p>
                            </NavLink>
                        </li>

                        {/* Appointments link */}
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    `flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                                    }`
                                }
                                to={'/all-appointments'}
                            >
                                <img src={assets.appointment_icon} alt="Appointments" />
                                <p className='hidden md:block'>Appointments</p>
                            </NavLink>
                        </li>

                        {/* Add Doctor link */}
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    `flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                                    }`
                                }
                                to={'/add-doctor'}
                            >
                                <img src={assets.add_icon} alt="Add Doctor" />
                                <p className='hidden md:block'>Add Doctor</p>
                            </NavLink>
                        </li>

                        {/* Doctor List link */}
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    `flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                                    }`
                                }
                                to={'/doctor-list'}
                            >
                                <img src={assets.people_icon} alt="Doctor List" />
                                <p className='hidden md:block'>Doctor List</p>
                            </NavLink>
                        </li>
                    </ul>
                )}
                {dToken && (
                    <ul className='text-[#515151] mt-5'>
                        {/* Dashboard link */}
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    `flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                                    }`
                                }
                                to={'/doctor-dashboard'}
                            >
                                <img src={assets.home_icon} alt="Dashboard" />
                                <p className='hidden md:block'>Dashboard</p>
                            </NavLink>
                        </li>

                        {/* Appointments link */}
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    `flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                                    }`
                                }
                                to={'/doctor-appointments'}
                            >
                                <img src={assets.appointment_icon} alt="Add Doctor" />
                                <p className='hidden md:block'>Appointments</p>
                            </NavLink>
                        </li>

                        {/* Profile link */}
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    `flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
                                    }`
                                }
                                to={'/doctor-profile'}
                            >
                                <img src={assets.people_icon} alt="Doctor List" />
                                <p className='hidden md:block'>Profile</p>
                            </NavLink>
                        </li>
                    </ul>
                )}
            </div>
        </div>
    )
}

export default Sidebar
