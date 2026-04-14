// src/pages/Profile.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; 
import { FaUserCircle, FaEnvelope, FaPhone, FaCalendarAlt, FaStar, FaCogs, FaEdit } from "react-icons/fa";
 

const formatDate = (timestamp) => {
  if (!timestamp) return "Data Nots Found";
  try {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return "Invalid Date Format";
  }
};

const Profile = ({ user, isPremium }) => {
  const navigate = useNavigate(); 
  const creationTime = user?.metadata?.creationTime || user?.createdAt;
  
  const handleUpdateClick = () => {
    navigate("/dashboard/update-profile");
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-red-400">
        <p className="text-2xl font-bold drop-shadow-[0_0_8px_#FF0000]">
            // ERROR: USER DATA NOT DETECTED. LOGIN REQUIRED //
        </p>
      </div>
    );
  }

  const dataFields = [
    { icon: FaEnvelope, title: "GRID EMAIL", value: user.email || "Access Denied" },
    { icon: FaPhone, title: "COMM. CONTACT", value: user.phoneNumber || "Not Assigned" },
    { 
        icon: FaCalendarAlt, 
        title: "INITIAL CONNECTION", 
        value: formatDate(creationTime)
    },
    { icon: FaCogs, title: "SYSTEM ROLE", value: user.role || "Standard User" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12 relative overflow-hidden">
      {/* Futuristic Grid Background Effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-cover opacity-10 pointer-events-none" style={{ backgroundImage: "url('/grid-pattern.png')" }}></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-900 via-gray-950 to-fuchsia-900 opacity-30 blur-3xl pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto space-y-12 z-10">
        {/* Profile Header - Holographic Card */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 shadow-[0_0_20px_#FF00FF22] border-t-4 border-fuchsia-500/80 transform hover:scale-[1.01] transition-transform duration-500">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="flex-shrink-0 relative">
              <img
                src={user.photoURL || "/default-avatar.png"}
                alt={user.displayName || "User Avatar"}
                className="w-40 h-40 rounded-full object-cover border-4 border-cyan-400 shadow-[0_0_15px_#00FFFF] transition-all duration-300 hover:shadow-[0_0_25px_#00FFFF]"
              />
                {/* Status Indicator */}
                <span className={`absolute bottom-2 right-2 w-8 h-8 rounded-full border-4 border-gray-950 ${isPremium ? 'bg-yellow-400 shadow-[0_0_10px_#FFD700]' : 'bg-green-500 shadow-[0_0_10px_#00FF00]'}`}>
                    {isPremium && <FaStar className="w-full h-full p-1 text-black" />}
                </span>
            </div>
            
            <div className="mt-6 md:mt-0 md:ml-8 flex-1 space-y-3 text-center md:text-left">
              <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 drop-shadow-[0_0_10px_#FF00FF]">
                {user.displayName || "ANONYMOUS NODE"}
              </h1>
              
              <p className={`text-xl font-semibold ${isPremium ? 'text-yellow-300 drop-shadow-[0_0_5px_#FFD700]' : 'text-cyan-300'}`}>
                STATUS: {isPremium ? "PREMIUM ARCHITECT" : "STANDARD OPERATOR"}
              </p>

              {/* UPDATE PROFILE BUTTON WITH SECURITY */}
              <div className="pt-4">
                <button 
                  onClick={handleUpdateClick} 
                  className="relative inline-flex items-center gap-3 px-8 py-3 font-mono text-sm font-bold tracking-[0.15em] text-cyan-400 uppercase transition-all duration-500 group overflow-hidden"
                  style={{
                    clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)",
                    background: "rgba(6, 182, 212, 0.1)",
                    borderLeft: "2px solid #22d3ee",
                    borderRight: "2px solid #d946ef", 
                  }}
                >
                  {/* Background Glow Effect on Hover */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>

                  {/* Scanning Line Animation */}
                  <span className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_#22d3ee] -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>

                  {/* Icon with Glitch-like movement */}
                  <FaEdit className="relative z-10 text-lg group-hover:scale-110 group-hover:rotate-[-10deg] transition-transform duration-300" /> 
                  
                  <span className="relative z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                    Update Your Profile
                  </span>

                  {/* Decorative Corners */}
                  <span className="absolute top-0 right-0 w-1 h-4 bg-fuchsia-500 shadow-[0_0_10px_#d946ef]"></span>
                  <span className="absolute bottom-0 left-0 w-4 h-1 bg-cyan-500 shadow-[0_0_10px_#22d3ee]"></span>
                </button>
              </div>

              <p className="text-gray-400 italic text-sm mt-4">
                // USER ID: {user.uid} //
              </p>
            </div>
          </div>
        </div>

        {/* Info Grid - Data Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dataFields.map((field, index) => (
            <div
              key={index}
              className="bg-gray-800/70 rounded-xl p-5 shadow-lg border border-cyan-500/20 transition-all duration-300 hover:shadow-[0_0_15px_#00FFFF44] hover:bg-gray-700/80"
            >
              <field.icon className="text-cyan-400 text-3xl mb-3 drop-shadow-[0_0_5px_#00FFFF]" />
              <h2 className="font-bold text-sm uppercase text-gray-400 mb-1 tracking-widest">
                {field.title}
              </h2>
              <p className="text-lg font-mono break-words text-white">
                {field.value}
              </p>
            </div>
          ))}
        </div>

        {/* Data Status Section */}
        <div className="text-center mt-12 text-gray-500 border-t border-cyan-500/50 pt-8">
          <p className="text-sm">
            // END OF PROFILE DATASTREAM // ACCESS LEVEL: {isPremium ? "MAXIMUM" : "STANDARD"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;