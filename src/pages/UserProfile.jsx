import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { toast } from "react-hot-toast";
 

const UserProfile = () => {
    const { user, updateUserProfile } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();

        setLoading(true);
        const name = e.target.name.value;
        const photo = e.target.photo.value;

        try {
            await updateUserProfile(name, photo);
            toast.success("Profile Updated in Neural Network!");
        } catch (error) {
            toast.error("Update Failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-5 duration-500">
            <div className="bg-[#11111d] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full"></div>
                
                <h2 className="text-3xl font-black mb-8 italic">EDIT <span className="text-cyan-400">IDENTITY</span></h2>
                
                <form onSubmit={handleUpdate} className="space-y-6 relative">
                    <div className="flex justify-center mb-8">
                        <img src={user?.photoURL} className="w-32 h-32 rounded-full border-4 border-cyan-500/30 p-1 object-cover" alt="" />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                        <input name="name" defaultValue={user?.displayName} className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl p-4 mt-2 focus:border-cyan-500 outline-none transition-all" />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Profile Photo URL</label>
                        <input name="photo" defaultValue={user?.photoURL} className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl p-4 mt-2 focus:border-cyan-500 outline-none transition-all" />
                    </div>

                    <button disabled={loading} className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#0a0a0f] font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                        {loading ? "SYNCING..." : "UPDATE PROFILE"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;