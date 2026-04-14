import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2, Loader2, ShieldAlert, User, Mail, Lock } from "lucide-react"; 
import { toast } from "react-hot-toast";
import { getAllUsers, deleteUser, updateUserRole } from "../utils/api";
import { useAuth } from "../contexts/AuthContext"; 
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const ManageUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

 

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      toast.error("Failed to load user data!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- DELETE HANDLER (FIXED) ---
  const handleDeleteClick = (id, name) => {

    setUserToDelete({ id, name });
    setModalOpen(true);
  };

  // --- ROLE UPDATE HANDLER (FIXED) ---
  const handleRoleUpdate = async (id, currentRole) => {

    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      setActionLoading(id);
      await updateUserRole(id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
      toast.success(`Access Level: ${newRole.toUpperCase()}`);
    } catch (err) {
      toast.error("Failed to update role");
    } finally {
      setActionLoading(null);
    }
  };

  const confirmDelete = async () => {

    if (!userToDelete) return;

    try {
      setActionLoading(userToDelete.id);
      await deleteUser(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u._id !== userToDelete.id));
      toast.success("Identity Terminated Successfully");
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Failed to delete user");
    } finally {
      setActionLoading(null);
      setModalOpen(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen bg-[#01040D] text-white">

      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black uppercase tracking-widest text-white mb-2">
          USER <span className="text-[#40E0D0]">MATRIX</span>
        </h1>
        <div className="h-1 w-20 bg-[#40E0D0] mx-auto rounded-full"></div>
      </div>

      <div className="relative max-w-xl mx-auto mb-16">
        <input
          placeholder="Query Identity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0A0F1F] border border-white/10 py-4 pl-14 pr-6 rounded-2xl outline-none focus:border-[#40E0D0] transition-all"
        />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><Loader2 className="w-10 h-10 text-[#40E0D0] animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredUsers.map((user) => (
              <motion.div
                key={user._id}
                layout
                className="bg-[#0A0F1F] border border-white/5 rounded-[2.5rem] p-8 group relative overflow-hidden"
              >
                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    <img
                      src={user.photoURL || user.image || `https://ui-avatars.com/api/?name=${user.name}`}
                      className="w-24 h-24 rounded-3xl object-cover border-2 border-white/10 group-hover:border-[#40E0D0] transition-all"
                      alt="avatar"
                    />
                    <div className={`absolute -bottom-2 -right-2 p-2 rounded-xl ${user.role === 'admin' ? 'bg-fuchsia-600' : 'bg-[#40E0D0]'}`}>
                      {user.role === 'admin' ? <ShieldAlert className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                  <h2 className="text-xl font-black text-white truncate w-full text-center">{user.name || "Unknown"}</h2>
                  <p className="text-gray-500 text-xs font-mono mt-1"><Mail className="inline w-3 h-3 mr-1" />{user.email}</p>
                </div>

                <div className="flex gap-3">
                  {/* UPDATE ROLE BUTTON */}
                  <button
                    onClick={() => handleRoleUpdate(user._id, user.role)}
                    disabled={actionLoading === user._id} 
                    className="flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all bg-white/5 hover:bg-white/10 border-white/10"
                  >
                    {actionLoading === user._id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (user.role === 'admin' ? 'Demote' : 'Make Admin')}
                  </button>

                  {/* DELETE BUTTON - Updated logic applied */}
                  <button
                    onClick={() => handleDeleteClick(user._id, user.name)}
                    className="px-5 rounded-xl border transition-all bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        loading={actionLoading !== null}
        title="CRITICAL_TERMINATION"
        message={`Are you prepared to remove entity "${userToDelete?.name}"?`}
      />
    </div>
  );
};

export default ManageUsers;