import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaStar, FaEye, FaLock, FaGlobe, FaSearch, FaFilter, FaDatabase, FaBolt } from "react-icons/fa";
import { getAdminLessons, adminDeleteLesson, toggleFeatured } from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";

const ManageLessons = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterVisibility, setFilterVisibility] = useState("All");

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const data = await getAdminLessons();
      setLessons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to fetch lessons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLessons();
    }
  }, [user]);

  useEffect(() => {
    let result = [...lessons];
    if (filterCategory !== "All") {
      result = result.filter(l => l.category === filterCategory);
    }
    if (filterVisibility !== "All") {
      result = result.filter(l => l.visibility?.toLowerCase() === filterVisibility.toLowerCase());
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.creatorEmail?.toLowerCase().includes(q)
      );
    }
    setFilteredLessons(result);
  }, [filterCategory, filterVisibility, searchQuery, lessons]);


  const handleToggleFeatured = async (id, currentStatus) => {
    try {
      setActionLoading(true);
      const updatedStatus = !currentStatus;
      await toggleFeatured(id, updatedStatus);
      toast.success(updatedStatus ? "Marked as Featured ✨" : "Removed from Featured");
      setLessons(prev => prev.map(l => l._id === id ? { ...l, isFeatured: updatedStatus } : l));
    } catch (err) {
      toast.error("Failed to update featured status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ This will permanently delete the lesson. Are you sure?")) return;
    
    try {
      setActionLoading(true);
      await adminDeleteLesson(id);
      toast.success("Lesson Deleted Permanently");
      setLessons(prev => prev.filter(l => l._id !== id));
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setActionLoading(false);
    }
  };

  const categories = ["All", ...new Set(lessons.map(l => l.category))].filter(Boolean);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 md:p-12 bg-gray-800 min-h-screen text-green-200 selection:bg-[#40E0D0] selection:text-black relative overflow-hidden">

      {/* Background Cyber-Aura */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#40E0D0]/5 blur-[120px] rounded-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-[1600px] mx-auto">

        {/* Header Section */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-12 gap-8">
          <div className="border-l-4 border-[#40E0D0] pl-6 py-2">
            <div className="flex items-center gap-2 mb-2">
              <FaBolt className="text-[#40E0D0] animate-pulse text-xs" />
              <span className="text-[10px] font-black tracking-[0.5em] text-gray-500 uppercase">System Core / Lessons</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none">
              MANAGES <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#40E0D0] to-blue-500 italic">DATABASE</span>
            </h1>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full xl:w-auto">
            <StatCard title="Storage" count={lessons.length} icon={<FaDatabase />} color="text-cyan-400" />
            <StatCard title="Public" count={lessons.filter(l => l.visibility?.toLowerCase() === 'public').length} icon={<FaGlobe />} color="text-green-400" />
            <StatCard title="Featured" count={lessons.filter(l => l.isFeatured).length} icon={<FaStar />} color="text-yellow-400" />
            <StatCard title="Premium" count={lessons.filter(l => l.accessLevel?.toLowerCase() === 'premium').length} icon={<FaLock />} color="text-purple-400" />
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-gray-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2rem] mb-8 flex flex-col lg:flex-row gap-4 items-center shadow-2xl">
          <div className="relative flex-grow w-full">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#40E0D0] opacity-50" />
            <input
              type="text"
              placeholder="Query database by title or identifier..."
              className="w-full bg-black/40 border border-white/10 text-sm p-4 pl-12 rounded-2xl outline-none focus:border-[#40E0D0]/50 transition-all placeholder:text-gray-600 font-mono"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="flex-1 lg:w-48 bg-black/40 border border-white/10 text-[11px] font-black p-4 rounded-2xl outline-none cursor-pointer hover:border-[#40E0D0]/30 transition uppercase tracking-widest"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            <select
              value={filterVisibility}
              onChange={(e) => setFilterVisibility(e.target.value)}
              className="flex-1 lg:w-48 bg-black/40 border border-white/10 text-[11px] font-black p-4 rounded-2xl outline-none cursor-pointer hover:border-[#40E0D0]/30 transition uppercase tracking-widest"
            >
              <option value="All">Global Vision</option>
              <option value="Public">Public Only</option>
              <option value="Private">Restricted</option>
            </select>
          </div>
        </div>

        {/* Main Table Container */}
        <div className="bg-gray-900/30 backdrop-blur-md rounded-[3rem] border border-white/5 overflow-hidden shadow-3xl relative">
          {actionLoading && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 border-t-4 border-b-4 border-[#40E0D0] rounded-full animate-spin"></div>
              <p className="text-xs font-black uppercase tracking-[0.5em] text-[#40E0D0] animate-pulse">Processing Request...</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/[0.03] text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
                <tr>
                  <th className="p-8">Node Identifier & Metadata</th>
                  <th className="p-8">Access Status</th>
                  <th className="p-8">Authorization</th>
                  <th className="p-8">Priority</th>
                  <th className="p-8 text-center">Protocol Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filteredLessons.map((lesson) => (
                  <tr key={lesson._id} className="hover:bg-[#40E0D0]/[0.02] transition-all group">
                    <td className="p-8">
                      <div className="flex flex-col">
                        <span className="font-black text-white group-hover:text-[#40E0D0] transition-colors text-lg tracking-tight uppercase italic">{lesson.title}</span>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] text-gray-600 font-mono tracking-tighter py-1 px-2 bg-black/40 rounded-md border border-white/5">{lesson.creatorEmail}</span>
                          <span className="text-[10px] text-[#FF00FF] font-black uppercase tracking-widest bg-[#FF00FF]/5 px-2 py-1 rounded border border-[#FF00FF]/10">{lesson.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      {lesson.visibility?.toLowerCase() === 'public' ?
                        <span className="inline-flex items-center gap-2 text-[#40E0D0] bg-[#40E0D0]/5 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest border border-[#40E0D0]/20 shadow-[0_0_15px_rgba(64,224,208,0.1)]">
                          <FaGlobe className="animate-spin-slow" /> PUBLIC_NODE
                        </span> :
                        <span className="inline-flex items-center gap-2 text-red-500 bg-red-500/5 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest border border-red-500/20">
                          <FaLock /> ENCRYPTED
                        </span>
                      }
                    </td>
                    <td className="p-8">
                      <span className={`text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border shadow-lg ${lesson.accessLevel?.toLowerCase() === 'premium' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'}`}>
                        {lesson.accessLevel}
                      </span>
                    </td>
                    <td className="p-8">
                      {lesson.isFeatured ? (
                        <div className="flex items-center gap-3 text-yellow-500">
                          <div className="relative">
                            <FaStar size={14} className="drop-shadow-[0_0_10px_#EAB308]" />
                            <div className="absolute inset-0 bg-yellow-500 blur-md opacity-30 animate-pulse"></div>
                          </div>
                          <span className="text-[11px] font-black tracking-tighter">FEATURED_CORE</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-700 font-black tracking-widest opacity-50 uppercase">Standard_Data</span>
                      )}
                    </td>
                    <td className="p-8">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => handleToggleFeatured(lesson._id, lesson.isFeatured)}
                          disabled={actionLoading}
                          title="Toggle Featured"
                          className={`p-4 rounded-[1.2rem] transition-all relative group/btn ${lesson.isFeatured ? 'bg-yellow-500 text-black shadow-[0_0_25px_rgba(234,179,8,0.4)] scale-110' : 'bg-white/5 text-gray-500 hover:bg-yellow-500/20 hover:text-yellow-500'}`}
                        >
                          <FaStar size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/lessons/${lesson._id}`)}
                          title="View Node"
                          className="p-4 bg-white/5 rounded-[1.2rem] text-red-500 hover:bg-[#40E0D0]/20 hover:text-[#40E0D0] hover:shadow-[0_0_25px_rgba(64,224,208,0.2)] transition-all"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(lesson._id)}
                          disabled={actionLoading}
                          title="Terminate Node"
                          className="p-4 bg-white/5 rounded-[1.2rem] text-pink-500 hover:bg-red-500/20 hover:text-red-500 hover:shadow-[0_0_25px_rgba(239,68,68,0.2)] transition-all"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLessons.length === 0 && (
              <div className="p-32 text-center flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 animate-pulse">
                  <FaFilter size={30} className="text-gray-700" />
                </div>
                <p className="text-gray-500 font-black uppercase tracking-[0.5em] text-sm">Empty Sector: No Data Found</p>
                <button
                  onClick={() => { setSearchQuery(""); setFilterCategory("All"); setFilterVisibility("All") }}
                  className="px-8 py-3 bg-[#40E0D0]/10 text-[#40E0D0] text-xs font-black rounded-full border border-[#40E0D0]/20 hover:bg-[#40E0D0] hover:text-black transition-all uppercase tracking-widest shadow-lg shadow-cyan-500/10"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] font-mono text-gray-700 uppercase tracking-[1em] opacity-30">
          Secure Terminal Node // 0xAF71_LES_MGMT
        </p>
      </div>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ title, count, icon, color }) => (
  <div className="bg-gray-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5 hover:border-[#40E0D0]/40 transition-all duration-700 group flex flex-col justify-between h-32 w-full md:w-48 shadow-xl">
    <div className="flex justify-between items-start">
      <span className={`text-lg ${color} opacity-40 group-hover:opacity-100 transition-opacity`}>{icon}</span>
      <div className="h-1.5 w-1.5 rounded-full bg-white/10 group-hover:bg-[#40E0D0] transition-colors"></div>
    </div>
    <div>
      <h2 className={`text-4xl font-black ${color} tracking-tighter leading-none`}>{count.toString().padStart(2, '0')}</h2>
      <p className="text-gray-600 text-[9px] uppercase font-black tracking-[0.2em] mt-2 group-hover:text-gray-400 transition-colors">{title}</p>
    </div>
  </div>
);

export default ManageLessons;