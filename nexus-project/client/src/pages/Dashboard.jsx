import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Folder, LogOut, LayoutDashboard } from 'lucide-react';

const Dashboard = ({ setToken }) => {
    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newProject, setNewProject] = useState({ title: '', description: '' });
    const navigate = useNavigate();

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/projects', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(res.data);
        } catch (err) {
            console.error("Failed to fetch projects", err);
            if (err.response?.status === 401) navigate('/');
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/projects', newProject, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            setNewProject({ title: '', description: '' });
            fetchProjects();
        } catch (err) {
            alert("Error creating project");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            {/* Header */}
            <header className="flex justify-between items-center mb-10 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <LayoutDashboard className="text-blue-500" size={28} />
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        Nexus Dashboard
                    </h1>
                </div>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-900/50 transition-all"
                >
                    <LogOut size={18} /> Logout
                </button>
            </header>

            <main className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Create Project Action Card */}
                    <button 
                        onClick={() => setShowModal(true)}
                        className="border-2 border-dashed border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-500 hover:border-blue-500/50 hover:bg-blue-500/5 hover:text-blue-500 transition-all group min-h-[200px]"
                    >
                        <div className="p-3 rounded-full bg-slate-900 group-hover:bg-blue-500/10 mb-3 transition-colors">
                            <Plus size={32} className="group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="font-semibold text-lg">New Project</span>
                    </button>

                    {/* Project Cards */}
                    {projects.map(project => (
                        <Link 
                            key={project.id} 
                            to={`/project/${project.id}`}
                            className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                        <Folder size={24} />
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Project ID: {project.id}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                                <p className="text-slate-400 text-sm line-clamp-3 mb-6">
                                    {project.description || "No description provided for this project."}
                                </p>
                            </div>
                            <div className="flex items-center text-blue-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                View Kanban Board →
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <form onSubmit={handleCreate} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h2 className="text-2xl font-bold mb-2">Create Project</h2>
                        <p className="text-slate-400 mb-6 text-sm">Organize your tasks and team in a new workspace.</p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Title</label>
                                <input 
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 mt-1 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="e.g. E-commerce Website"
                                    value={newProject.title}
                                    onChange={e => setNewProject({...newProject, title: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Description</label>
                                <textarea 
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 mt-1 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="What's this project about?"
                                    rows="3"
                                    value={newProject.description}
                                    onChange={e => setNewProject({...newProject, description: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button 
                                type="button" 
                                onClick={() => setShowModal(false)} 
                                className="flex-1 px-4 py-3 rounded-xl font-semibold text-slate-400 hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="flex-1 bg-blue-600 py-3 rounded-xl font-bold hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all"
                            >
                                Launch Project
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Dashboard;