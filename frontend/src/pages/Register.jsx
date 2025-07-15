import '../styles/dashboard.css'
import axiosInstance from "../api/axiosConfig.jsx";
import {useState} from "react";

export default function Register() {
    const [title, setTitle] = useState('');
    const [numModuleGroups, setNumModuleGroups] = useState(1);
    const [modules, setModules] = useState([['']]);
    const [loading, setLoading] = useState(false);

    // Update number of module groups
    const handleNumModuleGroupsChange = (e) => {
        const n = parseInt(e.target.value, 10) || 1;
        setNumModuleGroups(n);
        setModules(prev => {
            const newModules = [...prev];
            if (n > newModules.length) {
                // Add new empty groups
                for (let i = newModules.length; i < n; i++) {
                    newModules.push(['']);
                }
            } else {
                // Remove extra groups
                newModules.length = n;
            }
            return newModules;
        });
    };

    // Update module name in a group
    const handleModuleChange = (groupIdx, modIdx, value) => {
        setModules(prev => {
            const updated = prev.map(arr => [...arr]);
            updated[groupIdx][modIdx] = value;
            return updated;
        });
    };

    // Add module input to a group
    const addModuleToGroup = (groupIdx) => {
        setModules(prev => {
            const updated = prev.map(arr => [...arr]);
            updated[groupIdx].push('');
            return updated;
        });
    };

    // Remove module input from a group
    const removeModuleFromGroup = (groupIdx, modIdx) => {
        setModules(prev => {
            const updated = prev.map(arr => [...arr]);
            updated[groupIdx].splice(modIdx, 1);
            return updated;
        });
    };

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const payload = {
            title, modules, // Optionally add course_id or other fields here
        };
        try {
            console.log(payload);
            await axiosInstance.post('/registerCourse', payload);
            alert('Course registered!');
            setTitle('');
            setNumModuleGroups(1);
            setModules([['']]);
        } catch (err) {
            alert('Error registering course');
        } finally {
            setLoading(false);
        }
    };

    return (<div className="dashboard">
        <h1>Register Degree</h1>
        <form className="registerCourseForm" onSubmit={handleSubmit}>
            <label>Title</label>
            <input
                type="text"
                name="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter course title"
                required
            />
            <br/>

            <label>Number of Module Groups</label>
            <input
                type="number"
                min={1}
                name="numModuleGroups"
                value={numModuleGroups}
                onChange={handleNumModuleGroupsChange}
                required
            />
            <br/>

            {modules.map((group, groupIdx) => (
                <div key={groupIdx} style={{marginBottom: '1em', border: '1px solid #eee', padding: '10px'}}>
                    <strong>Module Group {groupIdx + 1}</strong>
                    {group.map((mod, modIdx) => (
                        <div key={modIdx} style={{display: 'flex', alignItems: 'center', marginBottom: 4}}>
                            <input
                                type="text"
                                value={mod}
                                onChange={e => handleModuleChange(groupIdx, modIdx, e.target.value)}
                                placeholder={`Module ${modIdx + 1}`}
                                required
                            />
                            {group.length > 1 && (
                                <button type="button" onClick={() => removeModuleFromGroup(groupIdx, modIdx)}
                                        style={{marginLeft: 4}}>-</button>)}
                        </div>))}
                    <button type="button" onClick={() => addModuleToGroup(groupIdx)}>Add Module</button>
                </div>))}

            <button type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register Degree'}
            </button>
        </form>
    </div>);
}