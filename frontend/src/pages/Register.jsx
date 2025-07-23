import '../styles/dashboard.css'
import '../styles/register.css'
import axiosInstance from "../api/axiosConfig.jsx";
import {useState} from "react";

export default function Register() {
    const [title, setTitle] = useState('');
    const [numModuleGroups, setNumModuleGroups] = useState('');
    const [modules, setModules] = useState([['']]);
    const [loading, setLoading] = useState(false);

    const handleNumModuleGroupsKeyDown = (e) => {
        // Allow only digits 0-9 and '10'
        if (
            !(
                (e.key >= '0' && e.key <= '9') ||
                (e.key === 'Backspace') ||
                (e.key === 'Delete') ||
                (e.key === 'Tab') ||
                (e.key === 'ArrowLeft') ||
                (e.key === 'ArrowRight')
            )
        ) {
            e.preventDefault();
        }
    };

    const handleNumModuleGroupsChange = (e) => {
        let val = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (val.length > 2) val = val.slice(0, 2);
        if (val === '') {
            setNumModuleGroups('');
            return;
        }
        let num = parseInt(val, 10);
        if (isNaN(num) || num < 0) num = 1;
        if (num > 10) num = 10;
        setNumModuleGroups(num);
        setModules(prev => {
            const newModules = [...prev];
            if (num > newModules.length) {
                for (let i = newModules.length; i < num; i++) newModules.push(['']);
            } else {
                newModules.length = num;
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
                        type="text"
                        inputMode="numeric"
                        name="numModuleGroups"
                        value={numModuleGroups}
                        onChange={handleNumModuleGroupsChange}
                        onKeyDown={handleNumModuleGroupsKeyDown}
                        required
                        autoComplete="off"
                        placeholder="Enter number (0-10)"
                        maxLength={2}
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