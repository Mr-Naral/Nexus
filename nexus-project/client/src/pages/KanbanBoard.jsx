import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle2, Circle, Clock } from 'lucide-react';

const KanbanBoard = () => {
    const { projectId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [taskTitle, setTaskTitle] = useState("");
    const [taskPriority, setTaskPriority] = useState("Medium");

    const getPriorityStyles = (priority) => {
    switch(priority?.toLowerCase()) {
            case 'high': 
                return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'low': 
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            default: // Medium
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        }
    };

    const fetchTasks = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/tasks/${projectId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(res.data);
        console.log(res.data,"tasks fetched for project", projectId);
    };

    useEffect(() => { fetchTasks(); }, [projectId]);

    const addTask = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        console.log("Adding task with title:", taskTitle, "and priority:", taskPriority);
        await axios.post('http://localhost:5000/tasks', { project_id: projectId, title: taskTitle ,priority: taskPriority }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setTaskTitle("");
        setTaskPriority("Medium");
        fetchTasks();
    };

    const updateStatus = async (id, newStatus) => {
        const token = localStorage.getItem('token');
        await axios.patch(`http://localhost:5000/tasks/${id}`, { status: newStatus }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchTasks();
    };

    const columns = [
        { title: 'Todo', icon: <Circle size={18}/>, color: 'text-slate-400' },
        { title: 'In-Progress', icon: <Clock size={18}/>, color: 'text-blue-400' },
        { title: 'Done', icon: <CheckCircle2 size={18}/>, color: 'text-emerald-400' }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <Link to="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white mb-6">
                <ArrowLeft size={20}/> Back to Projects
            </Link>

            <form onSubmit={addTask} className="mb-10 flex gap-4 max-w-xl">
                <input 
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Quick add a task..."
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    required
                />
                <select
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="add its priority..."
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    required
                    >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                </select>
                <button className="bg-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Add</button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {columns.map(col => (
                    <div key={col.title} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 min-h-[500px]">
                        <div className={`flex items-center gap-2 font-bold mb-6 ${col.color}`}>
                            {col.icon} {col.title}
                        </div>
                        
                        {/* <div className="space-y-4">
                            {tasks.filter(t => t.status === col.title).map(task => (
                                <div key={task.id} className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-md hover:border-slate-500 transition-all">
                                    <p className="mb-4">Title : {task.title}</p>
                                    <p className="mb-4 ">Priority : {task.priority}</p>
                                    <div className="flex gap-2">
                                        {col.title !== 'Todo' && <button onClick={() => updateStatus(task.id, 'Todo')} className="text-[10px] uppercase font-bold text-slate-500 hover:text-white">Todo</button>}
                                        {col.title !== 'In-Progress' && <button onClick={() => updateStatus(task.id, 'In-Progress')} className="text-[10px] uppercase font-bold text-blue-500 hover:text-white">Start</button>}
                                        {col.title !== 'Done' && <button onClick={() => updateStatus(task.id, 'Done')} className="text-[10px] uppercase font-bold text-emerald-500 hover:text-white">Finish</button>}
                                    </div>
                                </div>
                            ))}
                        </div> */}

                        <div className="space-y-4">
                            {tasks.filter(t => t.status === col.title).map(task => (
                                <div 
                                    key={task.id} 
                                    className="group bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-5 rounded-2xl shadow-lg hover:shadow-xl hover:border-blue-500/40 transition-all flex flex-col min-h-[140px]"
                                >
                                    {/* Top Row: Priority Badge */}
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md border ${getPriorityStyles(task.priority)}`}>
                                            {task.priority || 'Medium'}
                                        </span>
                                    </div>

                                    {/* Middle: Task Title */}
                                    <h4 className="text-white text-base font-medium leading-snug mb-4 flex-grow">
                                        {task.title}
                                    </h4>

                                    {/* Bottom Row: Actions (Separated by a subtle line) */}
                                    <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700/50">
                                        {col.title !== 'Todo' && (
                                            <button 
                                                onClick={() => updateStatus(task.id, 'Todo')} 
                                                className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                                            >
                                                Reset to Todo
                                            </button>
                                        )}
                                        
                                        {col.title !== 'In-Progress' && (
                                            <button 
                                                onClick={() => updateStatus(task.id, 'In-Progress')} 
                                                className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-blue-500/10 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-colors"
                                            >
                                                Start Task
                                            </button>
                                        )}
                                        
                                        {col.title !== 'Done' && (
                                            <button 
                                                onClick={() => updateStatus(task.id, 'Done')} 
                                                className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-emerald-500/10 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                                            >
                                                Mark Done
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KanbanBoard;