import React, { useState, useMemo } from "react";
import { FaEdit, FaTrash, FaUserPlus, FaEnvelope, FaBriefcase, FaTimes, FaSave, FaSearch, FaFilter, FaAngleDown, FaAngleUp, FaUsers, FaUserCheck, FaUserClock, FaLink, FaImage } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2"; 

const TeamManagement = () => {
  // --- 1. Data Generation Helper ---
  const generateData = () => {
    const roles = ["Frontend Dev", "Backend Dev", "UI/UX Designer", "QA Engineer", "DevOps", "Product Manager", "HR Manager", "Intern"];
    const statuses = ["Active", "Inactive", "On Leave"];
    const names = ["Rahim", "Karim", "Sabbir", "Tamim", "Nasir", "Mushfiq", "Mahmudullah", "Liton", "Taskin", "Mustafiz"];
    
    let data = [];
    for (let i = 1; i <= 150; i++) {
      const randomRole = roles[Math.floor(Math.random() * roles.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomName = `${names[Math.floor(Math.random() * names.length)]} ${names[Math.floor(Math.random() * names.length)]}`;
      
      data.push({
        id: i,
        name: randomName,
        role: randomRole,
        email: `user${i}@tech.com`,
        status: randomStatus,
        img: `https://i.pravatar.cc/150?u=${i + 50}` 
      });
    }
    return data;
  };

  // --- States ---
  const [members, setMembers] = useState(generateData());
  const [visibleCount, setVisibleCount] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  

  const [formData, setFormData] = useState({ name: "", role: "", email: "", status: "Active", photo: "" });


  const stats = useMemo(() => {
    return {
      total: members.length,
      active: members.filter(m => m.status === "Active").length,
      onLeave: members.filter(m => m.status === "On Leave").length
    };
  }, [members]);


  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            member.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "All" || member.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [members, searchTerm, filterRole]);


  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#374151",
      confirmButtonText: "Yes, remove member!",
      background: "#1e1b2c",
      color: "#fff"
    }).then((result) => {
      if (result.isConfirmed) {
        setMembers(members.filter((m) => m.id !== id));
        Swal.fire({
            title: "Deleted!",
            text: "Member has been removed.",
            icon: "success",
            background: "#1e1b2c",
            color: "#fff"
        });
      }
    });
  };

  //  Edit Handler 
  const handleEdit = (member) => {
    setCurrentUser(member);
    setFormData({ 
      name: member.name, 
      role: member.role, 
      email: member.email, 
      status: member.status,
      photo: member.img 
    });
    setIsModalOpen(true);
  };

  // Add Handler
  const handleAddNew = () => {
    setCurrentUser(null);
    setFormData({ name: "", role: "", email: "", status: "Active", photo: "" });
    setIsModalOpen(true);
  };


  const handleSave = (e) => {
    e.preventDefault();

    // --- Proceed to Save ---
    const imageToUse = formData.photo.trim() !== "" 
      ? formData.photo 
      : (currentUser ? currentUser.img : `https://i.pravatar.cc/150?u=${Date.now()}`);

    const memberData = {
      name: formData.name,
      role: formData.role,
      email: formData.email,
      status: formData.status,
      img: imageToUse 
    };

    if (currentUser) {
      setMembers(members.map((m) => m.id === currentUser.id ? { ...m, ...memberData } : m));
      toast.success("Profile updated!");
    } else {
      const newMember = { id: Date.now(), ...memberData };
      setMembers([newMember, ...members]); 
      toast.success("New member joined!");
    }
    setIsModalOpen(false);
  };

  // --- View Controls ---
  const handleLoadMore = () => setVisibleCount(prev => prev + 20);
  const handleViewAll = () => setVisibleCount(filteredMembers.length);
  const handleShowLess = () => {
    setVisibleCount(10);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  return (
    <div className="p-6 min-h-screen text-white animate-fadeIn pb-20">
      
      {/* --- Top Header & Stats --- */}
      <div className="flex flex-col lg:flex-row justify-between items-end mb-8 gap-6">
        <div>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
            Team Overview
          </h2>
          <p className="text-gray-400 flex items-center gap-2">
            <FaBriefcase /> Manage your organization's talent pool.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-[#1e1b2c] p-4 rounded-xl border border-purple-500/30 flex items-center gap-3 shadow-lg">
            <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400"><FaUsers size={20}/></div>
            <div><h4 className="text-xl font-bold">{stats.total}</h4><p className="text-xs text-gray-400">Total</p></div>
          </div>
          <div className="bg-[#1e1b2c] p-4 rounded-xl border border-green-500/30 flex items-center gap-3 shadow-lg">
            <div className="p-3 bg-green-500/20 rounded-lg text-green-400"><FaUserCheck size={20}/></div>
            <div><h4 className="text-xl font-bold">{stats.active}</h4><p className="text-xs text-gray-400">Active</p></div>
          </div>
          <div className="bg-[#1e1b2c] p-4 rounded-xl border border-yellow-500/30 flex items-center gap-3 shadow-lg">
            <div className="p-3 bg-yellow-500/20 rounded-lg text-yellow-400"><FaUserClock size={20}/></div>
            <div><h4 className="text-xl font-bold">{stats.onLeave}</h4><p className="text-xs text-gray-400">On Leave</p></div>
          </div>
        </div>
      </div>

      {/* --- Controls Bar --- */}
      <div className="bg-[#1e1b2c] p-4 rounded-2xl border border-gray-700 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center shadow-xl">
        <div className="flex flex-1 gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
            <input 
              type="text" 
              placeholder="Search member..." 
              className="w-full bg-[#0b0e14] border border-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative w-full md:w-48">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
            <select 
              className="w-full bg-[#0b0e14] border border-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none cursor-pointer appearance-none"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="Frontend Dev">Frontend Dev</option>
              <option value="Backend Dev">Backend Dev</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="QA Engineer">QA Engineer</option>
              <option value="Product Manager">Product Manager</option>
            </select>
            <FaAngleDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"/>
          </div>
        </div>

        <button 
          onClick={handleAddNew}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold shadow-lg transition active:scale-95"
        >
          <FaUserPlus /> Add Member
        </button>
      </div>

      {/* --- Data Table --- */}
      <div className="bg-[#1e1b2c] rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
        {filteredMembers.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#262335] text-gray-400 text-sm uppercase tracking-wider">
                    <th className="p-5 font-semibold">Employee Profile</th>
                    <th className="p-5 font-semibold">Designation</th>
                    <th className="p-5 font-semibold">Status</th>
                    <th className="p-5 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredMembers.slice(0, visibleCount).map((member) => (
                    <tr key={member.id} className="hover:bg-white/5 transition duration-200 group">
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                             <img src={member.img} alt={member.name} className="w-12 h-12 rounded-full border-2 border-cyan-500/30 object-cover" />
                             <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1e1b2c] ${
                               member.status === 'Active' ? 'bg-green-500' : member.status === 'On Leave' ? 'bg-yellow-500' : 'bg-red-500'
                             }`}></span>
                          </div>
                          <div>
                            <p className="font-bold text-gray-100 text-base">{member.name}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                              <FaEnvelope size={10} /> {member.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="px-3 py-1 rounded-lg bg-[#0b0e14] border border-gray-700 text-gray-300 text-xs font-medium">
                          {member.role}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex w-fit items-center gap-1.5 ${
                          member.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                          member.status === 'Inactive' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                             member.status === 'Active' ? 'bg-green-400' : member.status === 'On Leave' ? 'bg-yellow-400' : 'bg-red-400'
                          }`}></span>
                          {member.status}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex justify-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(member)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition shadow-sm"><FaEdit /></button>
                          <button onClick={() => handleDelete(member.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition shadow-sm"><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-6 border-t border-gray-700 bg-[#262335] flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                Showing <span className="text-cyan-400 font-bold">{Math.min(visibleCount, filteredMembers.length)}</span> of <span className="text-white font-bold">{filteredMembers.length}</span> members
              </p>
              
              <div className="flex gap-3">
                {visibleCount < filteredMembers.length && (
                  <>
                    <button onClick={handleLoadMore} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold rounded-lg transition">Load More (+20)</button>
                    <button onClick={handleViewAll} className="px-4 py-2 bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30 text-sm font-bold rounded-lg transition border border-cyan-500/30">View All</button>
                  </>
                )}
                {visibleCount > 10 && (
                  <button onClick={handleShowLess} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-bold rounded-lg transition border border-red-500/30"><FaAngleUp /> Show Less</button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="p-16 text-center text-gray-500">
            <FaSearch className="text-4xl mx-auto mb-4 opacity-30"/>
            <p className="text-lg">No members found matching your search.</p>
          </div>
        )}
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn p-4">
          <div className="bg-[#1e1b2c] w-full max-w-lg rounded-2xl border border-gray-600 shadow-2xl overflow-hidden animate-scaleIn">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-[#262335]">
              <h3 className="text-xl font-bold text-white">{currentUser ? "Edit Profile" : "Add New Talent"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><FaTimes size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-5">
              
              {/* New Photo URL Field */}
              <div className="col-span-2">
                <label className="text-gray-400 text-xs uppercase font-bold mb-2 flex items-center gap-2">
                  <FaImage className="text-cyan-400"/> Profile Photo URL <span className="text-gray-600 text-[10px] lowercase">(Optional)</span>
                </label>
                <div className="relative">
                  <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
                  <input 
                    type="url" 
                    className="w-full bg-[#0b0e14] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-purple-500 focus:outline-none transition"
                    value={formData.photo} 
                    onChange={(e) => setFormData({...formData, photo: e.target.value})} 
                    placeholder="https://example.com/my-photo.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div>
                    <label className="text-gray-400 text-xs uppercase font-bold mb-2 block">Full Name</label>
                    <input type="text" required className="w-full bg-[#0b0e14] border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="John Doe"/>
                 </div>
                 <div>
                    <label className="text-gray-400 text-xs uppercase font-bold mb-2 block">Role</label>
                    <input type="text" required className="w-full bg-[#0b0e14] border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} placeholder="Developer"/>
                 </div>
              </div>

              <div>
                <label className="text-gray-400 text-xs uppercase font-bold mb-2 block">Email Address</label>
                <input type="email" required className="w-full bg-[#0b0e14] border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="john@example.com"/>
              </div>

              <div>
                <label className="text-gray-400 text-xs uppercase font-bold mb-2 block">Current Status</label>
                <select className="w-full bg-[#0b0e14] border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>

              <div className="flex gap-4 mt-8 pt-4 border-t border-gray-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition text-gray-200">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold transition shadow-lg text-white flex justify-center items-center gap-2"><FaSave /> Save Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;