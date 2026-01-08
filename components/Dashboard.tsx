
import React, { useState } from 'react';
import { Project } from '../types';

interface DashboardProps {
  projects: Project[];
  onAddProject: (name: string, client: string, address: string, color: string, line: string, glass: string) => void;
  onSelectProject: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, onAddProject, onSelectProject }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', client: '', address: '', color: '', line: '', glass: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client.trim()) return;
    const projectName = formData.name.trim() || `Obra ${formData.client.trim()}`;
    onAddProject(
      projectName, 
      formData.client.trim(), 
      formData.address.trim(),
      formData.color.trim(),
      formData.line.trim(),
      formData.glass.trim()
    );
    setIsAdding(false);
    setFormData({ name: '', client: '', address: '', color: '', line: '', glass: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center no-print">
        <div className="flex gap-2">
            <button className="bg-[#0078D4] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-100 uppercase tracking-widest flex items-center gap-2">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
               Mis Proyectos
            </button>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="bg-white text-slate-400 border border-slate-200 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              {isAdding ? 'Cerrar' : 'Nuevo +'}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Formulario Estilo Arista */}
        {isAdding && (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Datos del Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <input 
                    autoFocus
                    className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-[#0078D4] focus:bg-white outline-none font-bold text-slate-700 placeholder:text-slate-300 transition-all"
                    placeholder="Nombre y Apellido *"
                    required
                    value={formData.client}
                    onChange={(e) => setFormData({...formData, client: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <input 
                    className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-[#0078D4] focus:bg-white outline-none font-bold text-slate-700 placeholder:text-slate-300 transition-all"
                    placeholder="Teléfono"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Especificaciones de Obra</h3>
              <input 
                className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-[#0078D4] focus:bg-white outline-none font-bold text-slate-700 placeholder:text-slate-300 transition-all mb-4"
                placeholder="Nombre de Obra / Proyecto"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input 
                  className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-[#0078D4] focus:bg-white outline-none font-bold text-slate-700 placeholder:text-slate-300 transition-all"
                  placeholder="Color (Blanco, Negro, etc)"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                />
                <input 
                  className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-[#0078D4] focus:bg-white outline-none font-bold text-slate-700 placeholder:text-slate-300 transition-all"
                  placeholder="Línea (Modena, A30, etc)"
                  value={formData.line}
                  onChange={(e) => setFormData({...formData, line: e.target.value})}
                />
                <input 
                  className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-[#0078D4] focus:bg-white outline-none font-bold text-slate-700 placeholder:text-slate-300 transition-all"
                  placeholder="Tipo de Vidrio"
                  value={formData.glass}
                  onChange={(e) => setFormData({...formData, glass: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#0078D4] text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-100 hover:bg-[#006cc1] active:scale-[0.98] transition-all uppercase text-xs tracking-widest"
            >
              Crear Presupuesto
            </button>
          </form>
        )}

        {/* Lista de Proyectos */}
        <div className={`space-y-4 ${!isAdding ? 'md:col-span-2' : ''}`}>
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Listado de Proyectos</h3>
             <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded-full">{projects.length} ITEMS</span>
           </div>
          {projects.length === 0 ? (
            <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center text-slate-300 flex flex-col items-center">
               <svg className="w-16 h-16 opacity-10 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
               <p className="font-bold text-sm">No hay presupuestos activos</p>
               <p className="text-[10px] uppercase tracking-widest mt-2">Inicia uno nuevo arriba</p>
            </div>
          ) : (
            <div className={`grid gap-4 ${!isAdding ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
              {projects.map(project => (
                <div 
                  key={project.id} 
                  onClick={() => onSelectProject(project.id)}
                  className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 cursor-pointer flex justify-between items-center group transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 font-bold group-hover:bg-[#eef6ff] group-hover:text-[#0078D4] transition-colors">
                      {project.measurements.length.toString().padStart(2, '0')}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base">{project.name}</h4>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{project.client}</p>
                    </div>
                  </div>
                  <div className="text-slate-200 group-hover:text-[#0078D4] transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
