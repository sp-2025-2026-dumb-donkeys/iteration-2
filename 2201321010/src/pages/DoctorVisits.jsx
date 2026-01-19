import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Plus, Trash2, Edit2, Calendar, MapPin, User, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const DoctorVisits = () => {
    const initialFormState = {
        id: null,
        doctorName: '',
        specialty: '',
        location: '',
        date: '',
        time: '',
        reason: '',
        notes: ''
    };

    const [visits, setVisits] = useLocalStorage('doctorVisits', []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentVisit, setCurrentVisit] = useState(initialFormState);

    const handleOpenModal = (visit = null) => {
        if (visit) {
            setCurrentVisit(visit);
            setIsEditing(true);
        } else {
            setCurrentVisit({ ...initialFormState, id: Date.now() });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!currentVisit.doctorName || !currentVisit.date) {
            toast.error('Please fill in required fields');
            return;
        }

        if (isEditing) {
            setVisits(visits.map(v => v.id === currentVisit.id ? currentVisit : v));
            toast.success('Visit updated successfully');
        } else {
            setVisits([...visits, currentVisit]);
            toast.success('Visit scheduled successfully');
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        setVisits(visits.filter(v => v.id !== id));
        toast.success('Visit cancelled');
    };

    // Sort visits by date
    const sortedVisits = [...visits].sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="heading-lg mb-1">Doctor Visits</h2>
                    <p className="text-[var(--text-muted)]">Track upcoming appointments and history</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn btn-primary"
                >
                    <Plus size={18} /> Schedule Visit
                </button>
            </div>

            <div className="space-y-4">
                <AnimatePresence>
                    {sortedVisits.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 text-[var(--text-muted)]"
                        >
                            <div className="bg-[var(--bg-card)] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                <Calendar size={32} opacity={0.5} />
                            </div>
                            <p className="text-lg">No visits scheduled.</p>
                        </motion.div>
                    )}

                    {sortedVisits.map((visit) => (
                        <motion.div
                            key={visit.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="card flex flex-col md:flex-row gap-6 hover:border-[var(--primary)] group"
                        >
                            <div className="flex-shrink-0 flex flex-col items-center justify-center p-4 bg-[var(--bg-card-hover)] rounded-xl w-full md:w-32 text-center">
                                <span className="text-sm font-bold text-[var(--primary)] uppercase">
                                    {new Date(visit.date).toLocaleString('default', { month: 'short' })}
                                </span>
                                <span className="text-3xl font-bold">
                                    {new Date(visit.date).getDate()}
                                </span>
                                <span className="text-xs text-[var(--text-muted)]">{visit.time}</span>
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{visit.doctorName}</h3>
                                        <p className="text-[var(--primary)] font-medium text-sm">{visit.specialty}</p>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleOpenModal(visit)} className="btn-icon hover:text-[var(--primary)]">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(visit.id)} className="btn-icon hover:text-[var(--danger)]">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[var(--text-muted)] mt-4">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        <span>{visit.location || 'No location set'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileText size={16} />
                                        <span>{visit.reason || 'Routine Checkup'}</span>
                                    </div>
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
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">{isEditing ? 'Edit Visit' : 'Schedule Visit'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="btn-icon">
                                    {/* SVG Icon for Close since import might conflict or be circular if not careful, though imported above */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Doctor Name</label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="Dr. Smith"
                                            value={currentVisit.doctorName}
                                            onChange={(e) => setCurrentVisit({ ...currentVisit, doctorName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Specialty</label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="Cardiology"
                                            value={currentVisit.specialty}
                                            onChange={(e) => setCurrentVisit({ ...currentVisit, specialty: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Location</label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="Clinic A"
                                            value={currentVisit.location}
                                            onChange={(e) => setCurrentVisit({ ...currentVisit, location: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Date</label>
                                        <input
                                            type="date"
                                            className="input"
                                            value={currentVisit.date}
                                            onChange={(e) => setCurrentVisit({ ...currentVisit, date: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Time</label>
                                        <input
                                            type="time"
                                            className="input"
                                            value={currentVisit.time}
                                            onChange={(e) => setCurrentVisit({ ...currentVisit, time: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Reason for Visit</label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Regular checkup, pain in..."
                                        value={currentVisit.reason}
                                        onChange={(e) => setCurrentVisit({ ...currentVisit, reason: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Notes</label>
                                    <textarea
                                        className="input min-h-[80px]"
                                        placeholder="Questions to ask..."
                                        value={currentVisit.notes}
                                        onChange={(e) => setCurrentVisit({ ...currentVisit, notes: e.target.value })}
                                    />
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                                    <button type="submit" className="btn btn-primary">{isEditing ? 'Save Changes' : 'Schedule Visit'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DoctorVisits;
