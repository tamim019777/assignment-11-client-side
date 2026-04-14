import React, { useState } from 'react';
import { FaUsers, FaTasks, FaClipboardCheck, FaDollarSign, FaTrashAlt } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Swal from 'sweetalert2';

const ManagerHome = () => {


  const [teamData, setTeamData] = useState([
    { id: 1, name: "Rahim", task: "Frontend Fix", status: "Completed", date: "12 Jan" },
    { id: 2, name: "Karim", task: "API Integration", status: "In Progress", date: "13 Jan" },
    { id: 3, name: "Sabbir", task: "Database Design", status: "Pending", date: "14 Jan" },
    { id: 4, name: "Tamim", task: "Testing", status: "Completed", date: "10 Jan" },
  ]);

  const projectData = [
    { name: 'Jan', active: 40, completed: 24 },
    { name: 'Feb', active: 30, completed: 13 },
    { name: 'Mar', active: 20, completed: 58 },
    { name: 'Apr', active: 27, completed: 39 },
    { name: 'May', active: 18, completed: 48 },
  ];

  const pieData = [
    { name: 'Pending', value: 400 },
    { name: 'Done', value: 300 },
    { name: 'Review', value: 300 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const handleDeleteTask = (id) => {

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#374151",
      confirmButtonText: "Yes, delete task!",
      background: "#1e1b2c",
      color: "#fff"
    }).then((result) => {
      if (result.isConfirmed) {
   
        const remaining = teamData.filter(item => item.id !== id);
        setTeamData(remaining);
        
        Swal.fire({
            title: "Deleted!",
            text: "Task has been removed.",
            icon: "success",
            background: "#1e1b2c",
            color: "#fff"
        });
      }
    });
  };

  return (
    <div className="p-6 text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-purple-400">Manager Dashboard</h2>

      {/* --- 1. Overview Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1e1b2c] p-5 rounded-2xl shadow-lg border border-purple-500/30 flex items-center gap-4">
          <FaUsers className="text-4xl text-purple-400" />
          <div>
            <h3 className="text-2xl font-bold">12</h3>
            <p className="text-sm text-gray-400">Team Members</p>
          </div>
        </div>
        <div className="bg-[#1e1b2c] p-5 rounded-2xl shadow-lg border border-blue-500/30 flex items-center gap-4">
          <FaTasks className="text-4xl text-blue-400" />
          <div>
            <h3 className="text-2xl font-bold">34</h3>
            <p className="text-sm text-gray-400">Active Projects</p>
          </div>
        </div>
        <div className="bg-[#1e1b2c] p-5 rounded-2xl shadow-lg border border-green-500/30 flex items-center gap-4">
          <FaClipboardCheck className="text-4xl text-green-400" />
          <div>
            <h3 className="text-2xl font-bold">89%</h3>
            <p className="text-sm text-gray-400">Completion Rate</p>
          </div>
        </div>
        <div className="bg-[#1e1b2c] p-5 rounded-2xl shadow-lg border border-yellow-500/30 flex items-center gap-4">
          <FaDollarSign className="text-4xl text-yellow-400" />
          <div>
            <h3 className="text-2xl font-bold">$12k</h3>
            <p className="text-sm text-gray-400">Revenue</p>
          </div>
        </div>
      </div>

      {/* --- 2. Charts Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart */}
        <div className="bg-[#1e1b2c] p-6 rounded-2xl border border-gray-700 shadow-xl">
          <h3 className="text-xl font-bold mb-4 text-gray-200">Project Progress</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                <Bar dataKey="active" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-[#1e1b2c] p-6 rounded-2xl border border-gray-700 shadow-xl flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4 text-gray-200">Task Status</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- 3. Data Table with Security --- */}
      <div className="bg-[#1e1b2c] p-6 rounded-2xl border border-gray-700 shadow-xl overflow-x-auto">
        <h3 className="text-xl font-bold mb-4 text-gray-200">Recent Team Activity</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="p-3">ID</th>
              <th className="p-3">Member Name</th>
              <th className="p-3">Current Task</th>
              <th className="p-3">Status</th>
              <th className="p-3">Deadline</th>
              <th className="p-3 text-center">Action</th> {/* Action Column Added */}
            </tr>
          </thead>
          <tbody>
            {teamData.map((item) => (
              <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition text-gray-300">
                <td className="p-3">#{item.id}</td>
                <td className="p-3 font-bold text-white">{item.name}</td>
                <td className="p-3 text-sm">{item.task}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    item.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                    item.status === 'Pending' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-3 text-gray-400 text-sm">{item.date}</td>
                
                {/* Delete Button with Security */}
                <td className="p-3 text-center">
                    <button 
                        onClick={() => handleDeleteTask(item.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                        <FaTrashAlt />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerHome;