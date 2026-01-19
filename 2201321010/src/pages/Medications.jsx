import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Plus, Trash2, Edit2, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const Medications = () => {
    // Form State
    const initialFormState = {
        id: null,
        name: '',
        dosage: '',
        frequency: 'Daily',
        time: '09:00',
        stock: 0,
        notes: ''
    };

    const [medications, setMedications] = useLocalStorage('medications', []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMed, setCurrentMed] = useState(initialFormState);

    const handleOpenModal = (med = null) => {
        if (med) {
            setCurrentMed(med);
            setIsEditing(true);
        } else {
            setCurrentMed({ ...initialFormState, id: Date.now() });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!currentMed.name || !currentMed.dosage) {
            toast.error('Please fill in required fields');
            return;
        }

        if (isEditing) {
            setMedications(medications.map(m => m.id === currentMed.id ? currentMed : m));
            toast.success('Medication updated successfully');
        } else {
            setMedications([...medications, currentMed]);
            toast.success('Medication added successfully');
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        setMedications(medications.filter(m => m.id !== id));
        toast.success('Medication removed');
    };

    const takeMedication = (id) => {
        // Logic to mark as taken for the day could go here
        // For now just decrement stock
        const med = medications.find(m => m.id === id);
        if (med.stock > 0) {
            const updated = { ...med, stock: med.stock - 1 };
            setMedications(medications.map(m => m.id === id ? updated : m));
            toast.success(`Took ${med.name}. Stock remaining: ${updated.stock}`);
        } else {
            toast.error('Out of stock!');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="heading-lg mb-1">Medications</h2>
                    <p className="text-[var(--text-muted)]">Manage your prescriptions and schedule</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn btn-primary"
                >
                    <Plus size={18} /> Add New
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {medications.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full text-center py-20 text-[var(--text-muted)]"
                        >
                            <div className="bg-[var(--bg-card)] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                <Plus size={32} opacity={0.5} />
                            </div>
                            <p className="text-lg">No medications added yet.</p>
                            <button onClick={() => handleOpenModal()} className="mt-4 text-[var(--primary)] hover:underline">Get started</button>
                        </motion.div>
                    )}

                    {medications.map((med) => (
                        <motion.div
                            key={med.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="card group relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{med.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                                        <span className="bg-[var(--bg-card-hover)] px-2 py-1 rounded text-xs">{med.dosage}</span>
                                        <span>•</span>
                                        <span>{med.frequency}</span>
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleOpenModal(med)} className="btn-icon hover:text-[var(--primary)]">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(med.id)} className="btn-icon hover:text-[var(--danger)]">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                                    <Clock size={16} className="text-[var(--accent)]" />
                                    <span>Next dose at {med.time}</span>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-dark)] border border-[var(--border)]">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${med.stock < 5 ? 'bg-[var(--danger)]' : 'bg-[var(--success)]'}`}></div>
                                        <span className="text-sm font-medium">{med.stock} pills left</span>
                                    </div>
                                    <button
                                        onClick={() => takeMedication(med.id)}
                                        className="text-xs bg-[var(--bg-card-hover)] hover:bg-[var(--primary)] hover:text-white px-3 py-1.5 rounded-lg transition-colors border border-[var(--border)]"
                                    >
                                        Take
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl p-6"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">{isEditing ? 'Edit Medication' : 'Add Medication'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="btn-icon"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Medication Name</label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="e.g. Amoxicillin"
                                        value={currentMed.name}
                                        onChange={(e) => setCurrentMed({ ...currentMed, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Dosage</label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="e.g. 500mg"
                                            value={currentMed.dosage}
                                            onChange={(e) => setCurrentMed({ ...currentMed, dosage: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Stock</label>
                                        <input
                                            type="number"
                                            className="input"
                                            value={currentMed.stock}
                                            onChange={(e) => setCurrentMed({ ...currentMed, stock: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Frequency</label>
                                        <select
                                            className="input"
                                            value={currentMed.frequency}
                                            onChange={(e) => setCurrentMed({ ...currentMed, frequency: e.target.value })}
                                        >
                                            <option>Daily</option>
                                            <option>Twice Daily</option>
                                            <option>Weekly</option>
                                            <option>As Needed</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Time</label>
                                        <input
                                            type="time"
                                            className="input"
                                            value={currentMed.time}
                                            onChange={(e) => setCurrentMed({ ...currentMed, time: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Notes</label>
                                    <textarea
                                        className="input min-h-[80px]"
                                        placeholder="Take with food..."
                                        value={currentMed.notes}
                                        onChange={(e) => setCurrentMed({ ...currentMed, notes: e.target.value })}
                                    />
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                                    <button type="submit" className="btn btn-primary">{isEditing ? 'Save Changes' : 'Add Medication'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Start hack to fix missing icon in Modal
function X({ size }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
}

// Reuse initial form state for resetting
const initialFormState = { id: null, name: '', dosage: '', frequency: 'Daily', time: '09:00', stock: 10, notes: '' };

export default Medications;
