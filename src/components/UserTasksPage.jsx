import React, { useEffect, useState } from 'react';
import {
    Container, TextField, Button, Typography, List, ListItem,
    IconButton, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import "../styles/UserTasksPage.css"



function UserTasksPage() {
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState({ title: '', description: '' });
    const [error, setError] = useState('');
    const [editData, setEditData] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchTasks();
    }, [token, navigate]);

    const fetchTasks = () => {
        axios.get('http://localhost:5000/api/tasks', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setTasks(res.data))
            .catch(err => console.log(err));
    };


    const handleCreate = async () => {
        if (!taskInput.title) return setError('Title required');
        try {
            const res = await axios.post('http://localhost:5000/api/tasks', taskInput, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks([...tasks, res.data]);
            setTaskInput({ title: '', description: '' });
        } catch {
            setError('Task creation failed');
        }
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(tasks.filter(t => t._id !== id));
    };

    const toggleStatus = async (task) => {
        const updated = {
            ...task,
            completed: task.completed === 'completed' ? 'pending' : 'completed'
        };
        await axios.put(`http://localhost:5000/api/tasks/${task._id}`, updated, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchTasks();
    };

    const handleEdit = (task) => {
        setEditData({ ...task });
    };

    const handleEditSave = async () => {
        await axios.put(`http://localhost:5000/api/tasks/${editData._id}`, editData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setEditData(null);
        fetchTasks();
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };


    return (






// <Container maxWidth="sm" className="task-container">
//   <div className="task-header">
//     <Typography variant="h4">Welcome, {localStorage.getItem('username')}</Typography>
//     <Button
//       variant="outlined"
//       color="secondary"
//       startIcon={<LogoutIcon />}
//       onClick={handleLogout}
//     >
//       Logout
//     </Button>
//   </div>

//   ...

//   <List className="task-list">
//     {tasks.map(task => (
//       <ListItem key={task._id} divider className="task-item">
//         ...
//       </ListItem>
//     ))}
//   </List>
// </Container>











        
        <Container maxWidth="sm" className='task-container'>
            <div className='task-header' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">Welcome, {localStorage.getItem('username')}</Typography>
                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </div>
            {error && <Typography color="error">{error}</Typography>}
            <TextField
                fullWidth label="Title" value={taskInput.title}
                onChange={(e) => setTaskInput({ ...taskInput, title: e.target.value })} margin="normal"
            />
            <TextField
                fullWidth label="Description" value={taskInput.description}
                onChange={(e) => setTaskInput({ ...taskInput, description: e.target.value })} margin="normal"
            />
            <Button variant="contained" onClick={handleCreate}>Add Task</Button>

            <List className='task-list'>
                {tasks.map(task => (
                    <ListItem className='task-item' key={task._id} divider>
                        <Checkbox
                            checked={task.completed === 'completed'}
                            onChange={() => toggleStatus(task)}
                        />
                        <Typography sx={{ flexGrow: 1 }}>
                            <strong>{task.title}</strong> – {task.description} [{task.completed}]
                        </Typography>
                        <IconButton onClick={() => handleEdit(task)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(task._id)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>

            {/* ✏️ Edit Dialog */}
            <Dialog open={!!editData} onClose={() => setEditData(null)}>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth label="Title" value={editData?.title || ''}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })} margin="dense"
                    />
                    <TextField
                        fullWidth label="Description" value={editData?.description || ''}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })} margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditData(null)}>Cancel</Button>
                    <Button variant="contained" onClick={handleEditSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default UserTasksPage;
