// src/pages/admin/AdminProfile.jsx
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth"; 
import { axiosInstance } from "../utils/api"; 
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
import { 
  ShieldCheck, Database, Activity, Clock, 
  Fingerprint, Calendar, Cpu, Zap, Radio, 
  UserPen 
} from "lucide-react";
 

const AdminProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); 
  const [stats, setStats] = useState({
    totalLessons: 0,
    reportedLessons: 0,
  });

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      try {
        const [lessonsRes, reportsRes] = await Promise.all([
          axiosInstance.get("/admin/total-lessons"),
          axiosInstance.get("/admin/reported-lessons-count"),
        ]);
        setStats({
          totalLessons: lessonsRes.data.total || 0,
          reportedLessons: reportsRes.data.total || 0,
        });
      } catch (err) {
        console.error("Profile Stats Error:", err);
      }
    };
    fetchStats();
  }, [user]);

  const handleUpdateClick = () => {
    navigate("/dashboard/profile"); 
  };

  if (!user) return null;

  return (
    
    <div className="min-h-screen p-6 md:p-12 bg-gray-50 dark:bg-[#01040D] text-gray-800 dark:text-gray-300 selection:bg-[#40E0D0]/30 overflow-hidden relative transition-colors duration-300">
      
      {/* Background Animated Glow (Dark Mode Only) */}
      <div className="absolute inset-0 z-0 opacity-20 hidden dark:block">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#40E0D0]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12 border-l-4 border-cyan-600 dark:border-[#40E0D0] pl-6 py-2"
        >
          <div className="flex items-center gap-3 text-cyan-600 dark:text-[#40E0D0] mb-2">
            <Cpu className="w-4 h-4 animate-spin-slow" />
            <span className="text-[10px] font-black tracking-[0.6em] uppercase opacity-70">
              System Administrator Node: 0x71A
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-gray-900 dark:text-white leading-none">
            CORE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-500 dark:from-[#40E0D0] dark:to-blue-500 italic">INTERFACE</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="xl:col-span-4 bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-white/10 backdrop-blur-xl rounded-[2rem] p-8 relative group overflow-hidden shadow-2xl"
          >
            {/* Holographic Scanner Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500 dark:bg-[#40E0D0] opacity-20 group-hover:animate-scan z-20" />
            
            <div className="relative flex flex-col items-center">
              <div className="relative mb-8">
                <div className="absolute -inset-2 border-2 border-dashed border-cyan-500/50 dark:border-[#40E0D0]/50 rounded-full animate-spin-slow" />
                <img
                  src={user.photoURL || "https://i.ibb.co/7zvZfJp/user.png"}
                  alt="Admin"
                  className="relative w-40 h-40 rounded-full border-4 border-gray-100 dark:border-gray-800 object-cover z-10"
                />
                <div className="absolute -bottom-2 -right-2 bg-white dark:bg-black border border-cyan-500 dark:border-[#40E0D0] p-2 rounded-xl shadow-[0_0_15px_#40E0D0]">
                  <Fingerprint className="w-6 h-6 text-cyan-600 dark:text-[#40E0D0]" />
                </div>
              </div>

              <div className="text-center space-y-2 w-full">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                  {user.displayName}
                </h2>
                <p className="text-cyan-700 dark:text-[#40E0D0] font-mono text-sm tracking-widest bg-cyan-100 dark:bg-[#40E0D0]/10 px-4 py-1 rounded-full border border-cyan-200 dark:border-[#40E0D0]/20 inline-block">
                  Level 01_OPERATOR
                </p>
                
                {/* UPDATE PROFILE BUTTON (With Security Check) */}
                <button 
                  onClick={handleUpdateClick}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-gray-900 dark:bg-white/10 hover:bg-cyan-600 dark:hover:bg-[#40E0D0] text-white hover:text-white dark:hover:text-black rounded-xl font-bold transition-all border border-transparent dark:border-white/10 group"
                >
                  <UserPen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  GO TO UPDATE PAGE
                </button>

                <div className="pt-6 grid grid-cols-2 gap-4 w-full text-left">
                  <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-200 dark:border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Status</p>
                    <p className="text-green-600 dark:text-green-400 text-xs font-mono flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" /> ONLINE
                    </p>
                  </div>
                  <div className="bg-gray-5 dark:bg-white/5 p-4 rounded-2xl border border-gray-200 dark:border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Sync</p>
                    <p className="text-blue-600 dark:text-blue-400 text-xs font-mono">ENCRYPTED</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="xl:col-span-8 space-y-8">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Data Integrity", val: stats.totalLessons, icon: Database, color: "#40E0D0", shadow: "rgba(64,224,208,0.2)" },
                { label: "Infection Alerts", val: stats.reportedLessons, icon: Radio, color: "#F87171", shadow: "rgba(248,113,113,0.2)" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden flex justify-between items-center group shadow-xl dark:shadow-none"
                  style={{ boxShadow: `inset 0 0 0px ${item.shadow}` }} 
                >
                  <div>
                    <p className="text-xs font-black uppercase text-gray-500 tracking-[0.3em] mb-2">{item.label}</p>
                    <h3 className="text-7xl font-black text-gray-900 dark:text-white">{item.val}</h3>
                  </div>
                  <item.icon className="w-24 h-24 absolute -right-4 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-30 transition-all text-gray-900 dark:text-white" style={{ color: '' }} />
                </motion.div>
              ))}
            </div>

            {/* System Logs */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-100 dark:bg-black/50 border border-gray-200 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 relative"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3 text-sm font-mono text-cyan-700 dark:text-[#40E0D0]">
                  <Zap className="w-4 h-4 fill-current" />
                  <span>METADATA_STREAM</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
              </div>

              <div className="space-y-4 font-mono">
                {[
                  { icon: Calendar, label: "INITIATION_DATE", val: user?.metadata?.creationTime },
                  { icon: Clock, label: "LAST_UPLINK", val: user?.metadata?.lastSignInTime },
                  { icon: ShieldCheck, label: "CORE_PERMISSION", val: "ROOT_ACCESS" },
                  { icon: Activity, label: "SYSTEM_LOAD", val: "0.04ms" }
                ].map((log, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white dark:bg-white/5 rounded-xl hover:bg-cyan-50 dark:hover:bg-[#40E0D0]/5 transition-colors group shadow-sm dark:shadow-none border border-gray-200 dark:border-transparent">
                    <div className="flex items-center gap-4">
                      <log.icon className="w-4 h-4 text-gray-500 group-hover:text-cyan-600 dark:group-hover:text-[#40E0D0]" />
                      <span className="text-[10px] font-black text-gray-500 uppercase">{log.label}</span>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      {log.val ? (idx < 2 ? new Date(log.val).toLocaleString() : log.val) : "PENDING..."}
                    </span>
                  </div>
                ))}
              </div>

              {/* Encryption Key Decoration */}
              <div className="absolute bottom-4 right-8 text-[8px] font-mono text-gray-400 dark:text-gray-800 tracking-[1em] select-none">
                ENCRYPTION_KEY: {user.uid.slice(0, 20)}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminProfile;