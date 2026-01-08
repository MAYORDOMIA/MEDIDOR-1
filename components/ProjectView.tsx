
import React from 'react';
import { Project, MeasurementModule } from '../types';
import { OPENING_TYPES } from '../constants';

interface ProjectViewProps {
  project: Project;
  onBack: () => void;
  onAddMeasurement: () => void;
  onEditMeasurement: (id: string) => void;
  onDeleteMeasurement: (id: string) => void;
  onDeleteProject: () => void;
  onViewReport: () => void;
}

const ProjectView: React.FC<ProjectViewProps> = ({ 
  project, onBack, onAddMeasurement, onEditMeasurement, onDeleteMeasurement, onDeleteProject, onViewReport
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between no-print px-2">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-[#0078D4] transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Proyectos
        </button>
        <div className="flex gap-2">
          <button 
            onClick={onViewReport}
            className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Planilla
          </button>
          <button 
            onClick={onAddMeasurement}
            className="bg-[#0078D4] text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95 transition-all"
          >
            + Conjunto
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Proyecto Seleccionado</h3>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{project.name}</h2>
            <p className="text-slate-400 font-bold text-xs mt-1 uppercase tracking-tighter">{project.client}</p>
          </div>
          <div className="bg-blue-50 text-[#0078D4] px-4 py-2 rounded-2xl font-black text-sm">
            {project.measurements.length} {project.measurements.length === 1 ? 'Conjunto' : 'Conjuntos'}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Resumen de Partida</h3>
        {project.measurements.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-[2.5rem] text-slate-300">
            <p className="font-bold text-sm">No hay aberturas en esta obra</p>
            <p className="text-[10px] uppercase tracking-widest mt-2">Carga una usando el botón superior</p>
          </div>
        ) : (
          project.measurements.map((m, idx) => {
            const xs = m.modules.map(mod => mod.x);
            const ys = m.modules.map(mod => mod.y);
            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);
            const cols = maxX - minX + 1;
            const rows = maxY - minY + 1;

            const rRatios = m.rowRatios || Array(rows).fill(1);
            const cRatios = m.colRatios || Array(cols).fill(1);
            
            const safeW = Math.max(1, m.width || 1);
            const safeH = Math.max(1, m.height || 1);

            return (
              <div 
                key={m.id} 
                className="bg-white p-5 rounded-[2.2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 relative group cursor-pointer active:scale-[0.99]"
                onClick={() => onEditMeasurement(m.id)}
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 flex-shrink-0 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-extrabold text-sm group-hover:bg-[#0078D4] group-hover:text-white transition-all duration-300">
                    {(idx + 1).toString().padStart(2, '0')}
                  </div>

                  <div className="w-24 h-24 bg-[#fafbfc] rounded-2xl border border-slate-100 flex items-center justify-center overflow-visible p-2">
                    <div 
                      className="relative transition-all overflow-visible flex items-center justify-center"
                      style={{ 
                        aspectRatio: `${safeW} / ${safeH}`,
                        width: safeW >= safeH ? '100%' : 'auto',
                        height: safeW < safeH ? '100%' : 'auto'
                      }}
                    >
                      <div className="w-full h-full relative bg-white border-[3px] border-[#1e293b] overflow-visible">
                        {/* Tapajuntas visuales reducidos */}
                        {m.tapajuntas?.top && <div className="absolute -top-[6px] -left-[6px] -right-[6px] h-[4px] bg-[#2563eb] z-20" />}
                        {m.tapajuntas?.bottom && <div className="absolute -bottom-[6px] -left-[6px] -right-[6px] h-[4px] bg-[#2563eb] z-20" />}
                        {m.tapajuntas?.left && <div className="absolute -left-[6px] -top-[6px] -bottom-[6px] w-[4px] bg-[#2563eb] z-20" />}
                        {m.tapajuntas?.right && <div className="absolute -right-[6px] -top-[6px] -bottom-[6px] w-[4px] bg-[#2563eb] z-20" />}

                        <div 
                          className="w-full h-full grid gap-[1px] bg-[#1e293b]"
                          style={{ 
                            gridTemplateColumns: cRatios.map(r => `${r}fr`).join(' '),
                            gridTemplateRows: rRatios.map(r => `${r}fr`).join(' ')
                          }}
                        >
                          {m.modules.map((mod, i) => (
                            <div 
                              key={i} 
                              className="bg-white flex items-center justify-center overflow-hidden"
                              style={{ gridColumn: mod.x - minX + 1, gridRow: mod.y - minY + 1 }}
                            >
                              <div className="w-full h-full">
                                {OPENING_TYPES.find(t => t.id === mod.typeId)?.icon}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-base leading-tight uppercase tracking-tight truncate max-w-[200px]">
                          {m.modules.length > 1 ? 'CONJUNTO ARISTA' : OPENING_TYPES.find(t => t.id === m.modules[0].typeId)?.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{m.width} x {m.height}mm</span>
                          {m.location && (
                            <>
                              <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                              <span className="text-[#0078D4] text-[10px] font-black uppercase tracking-widest truncate max-w-[100px]">📍 {m.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{m.code}</p>
                         <p className="text-emerald-500 font-black text-[10px] mt-1 truncate max-w-[120px]">{m.glass || 'A DEFINIR'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDeleteMeasurement(m.id); }}
                      className="p-3 text-slate-200 hover:text-red-400 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>

                {m.notes && (
                  <div className="ml-12 pl-6 border-l-2 border-slate-50">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed italic truncate max-w-full">
                      💬 {m.notes}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="pt-10 no-print">
        <button 
          onClick={onDeleteProject}
          className="text-slate-300 text-[9px] font-black hover:text-red-400 transition-colors w-full text-center py-4 tracking-[0.3em] uppercase border-t border-slate-100"
        >
          Borrar Proyecto Definitivamente
        </button>
      </div>
    </div>
  );
};

export default ProjectView;
