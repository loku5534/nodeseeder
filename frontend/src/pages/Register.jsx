import '../styles/dashboard.css'
import '../styles/register.css'
import axiosInstance from "../api/axiosConfig.jsx";
import {useState} from "react";

export default function Register() {
    const [title, setTitle] = useState('');
    const [numModuleGroups, setNumModuleGroups] = useState(4);
    const [modules, setModules] = useState([['']]);
    const [loading, setLoading] = useState(false);

    const handleNumModuleGroupsChange = (e) => {
        const n = parseInt(e.target.value, 10) || 1;
        setNumModuleGroups(n);
        setModules(prev => {
            const newModules = [...prev];
            if (n > newModules.length) {
                for (let i = newModules.length; i < n; i++) newModules.push(['']);
            } else {
                newModules.length = n;
            }
            return newModules;
        });
    };

    const handleModuleChange = (groupIdx, modIdx, value) => {
        setModules(prev => {
            const updated = prev.map(arr => [...arr]);
            updated[groupIdx][modIdx] = value;
            return updated;
        });
    };

    const addModuleToGroup = (groupIdx) => {
        setModules(prev => {
            const updated = prev.map(arr => [...arr]);
            updated[groupIdx].push('');
            return updated;
        });
    };

    const removeModuleFromGroup = (groupIdx, modIdx) => {
        setModules(prev => {
            const updated = prev.map(arr => [...arr]);
            updated[groupIdx].splice(modIdx, 1);
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const payload = { title, modules };
        try {
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

    return (
        <div className="register-container">
            <h1>Register Degree</h1>
            <form className="registerCourseForm card-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <label htmlFor="title">Title</label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Enter course title"
                        required
                    />
                </div>
                <div className="form-row">
                    <label htmlFor="numModuleGroups">Number of Semesters</label>
                    <input
                        id="numModuleGroups"
                        type="number"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        name="numModuleGroups"
                        value={numModuleGroups}
                        onChange={handleNumModuleGroupsChange}
                        required
                        autoComplete="off"
                        placeholder="Enter number"
                    />
                </div>
                {modules.map((group, groupIdx) => (
                    <div className="module-group-card" key={groupIdx}>
                        <div className="module-group-header">
                            <strong>Semester {groupIdx + 1}</strong>
                        </div>
                        {group.map((mod, modIdx) => (
                            <div className="form-row" key={modIdx}>
                                <label>{`Module ${modIdx + 1}`}</label>
                                <div className="module-input-row">
                                    <input
                                        type="text"
                                        value={mod}
                                        onChange={e => handleModuleChange(groupIdx, modIdx, e.target.value)}
                                        placeholder={`Module ${modIdx + 1}`}
                                        required
                                    />
                                    {group.length > 1 && (
                                        <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={() => removeModuleFromGroup(groupIdx, modIdx)}
                                            aria-label="Remove module"
                                        >-</button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="add-btn"
                            onClick={() => addModuleToGroup(groupIdx)}
                        >Add Module</button>
                    </div>
                ))}
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Registering...' : 'Register Degree'}
                </button>
            </form>
        </div>
    );
}