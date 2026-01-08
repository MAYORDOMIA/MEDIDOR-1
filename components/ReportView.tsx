
import React from 'react';
import { Project } from '../types';
import { OPENING_TYPES } from '../constants';

interface ReportViewProps {
  project: Project;
  onBack: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ project, onBack }) => {
  const handlePrint = () => window.print();

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-20 px-2">
      <div className="flex justify-between items-center no-print mb-4">
        <button onClick={onBack} className="text-slate-600 font-bold uppercase text-[10px] flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Volver
        </button>
        <button onClick={handlePrint} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-xl uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all">
          Imprimir PDF A4
        </button>
      </div>

      <div className="bg-white p-4 md:p-8 border border-slate-100 rounded-[1.5rem] print:p-0 print:border-none print:shadow-none min-h-[297mm] shadow-2xl">
        {/* Header Ultra-Compacto */}
        <div className="flex justify-between items-end border-b-2 border-slate-900 pb-3 mb-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 leading-none">ARISTA ESTUDIO</h1>
            <p className="text-blue-600 uppercase tracking-[0.2em] font-black text-[7px] mt-1">Planilla Técnica de Obra</p>
          </div>
          <div className="text-right">
            <div className="bg-slate-900 text-white px-2 py-0.5 text-[8px] font-black rounded mb-1 uppercase inline-block">{project.name}</div>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight leading-none">{project.client}</p>
          </div>
        </div>

        {/* Info Proyecto Compacta */}
        <div className="grid grid-cols-4 gap-2 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="flex flex-col">
            <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest">Línea</span>
            <span className="text-[9px] font-black text-slate-800 uppercase leading-none">{project.line || '-'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest">Color</span>
            <span className="text-[9px] font-black text-slate-800 uppercase leading-none">{project.color || '-'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest">Vidrio</span>
            <span className="text-[9px] font-black text-slate-800 uppercase leading-none">{project.glass || '-'}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest">Obra</span>
            <span className="text-[9px] font-black text-slate-800 uppercase truncate leading-none">{project.address || '-'}</span>
          </div>
        </div>

        {/* Listado de Aberturas */}
        <div className="space-y-2">
          {project.measurements.map((m, idx) => {
            const xs = m.modules.map(mod => mod.x);
            const ys = m.modules.map(mod => mod.y);
            const minX = Math.min(...xs);
            const minY = Math.min(...ys);
            const cols = Math.max(...xs) - minX + 1;
            const rows = Math.max(...ys) - minY + 1;
            
            const rRatios = m.rowRatios || Array(rows).fill(1);
            const cRatios = m.colRatios || Array(cols).fill(1);
            const safeW = Math.max(1, m.width || 1);
            const safeH = Math.max(1, m.height || 1);

            const totalColRatio = cRatios.reduce((a, b) => a + b, 0) || 1;
            const totalRowRatio = rRatios.reduce((a, b) => a + b, 0) || 1;
            const partialWidths = cRatios.map(r => Math.round((r / totalColRatio) * safeW));
            const partialHeights = rRatios.map(r => Math.round((r / totalRowRatio) * safeH));

            const moduleTypes = m.modules.map(mod => OPENING_TYPES.find(t => t.id === mod.typeId)?.name || '');
            const uniqueModuleTypes = Array.from(new Set(moduleTypes));
            const componentsText = uniqueModuleTypes.join(' + ');

            return (
              <div key={m.id} className="avoid-break bg-white p-3 border border-slate-200 rounded-xl flex flex-col gap-2 min-h-[140px]">
                <div className="flex flex-row items-center gap-4">
                  {/* DIBUJO TÉCNICO */}
                  <div className="w-[120px] flex-shrink-0 flex flex-col items-center justify-center relative bg-[#fafbfc] rounded-lg border border-slate-50 overflow-visible py-2">
                    <div className="relative w-full h-full max-w-[70%] max-h-[70%] flex items-center justify-center overflow-visible">
                        <div className="absolute -top-5 left-0 right-0 flex items-center px-1">
                          <div className="h-[0.5px] bg-slate-200 flex-1"></div>
                          <span className="mx-0.5 text-slate-400 font-black text-[6px] tabular-nums">{m.width}</span>
                          <div className="h-[0.5px] bg-slate-200 flex-1"></div>
                        </div>
                        <div className="absolute -right-6 top-0 bottom-0 flex flex-col items-center justify-center py-1">
                          <div className="w-[0.5px] bg-slate-200 flex-1"></div>
                          <span className="my-0.5 text-slate-400 font-black text-[6px] [writing-mode:vertical-lr] tabular-nums">{m.height}</span>
                          <div className="w-[0.5px] bg-slate-200 flex-1"></div>
                        </div>

                        <div 
                          className="relative flex flex-col items-center justify-center" 
                          style={{ 
                            aspectRatio: `${safeW} / ${safeH}`,
                            width: safeW >= safeH ? '100%' : 'auto',
                            height: safeW < safeH ? '100%' : 'auto'
                          }}
                        >
                          <div className="w-full h-full relative bg-white border-[2px] border-[#1e293b] overflow-visible">
                            {m.tapajuntas?.top && <div className="absolute -top-[5px] -left-[5px] -right-[5px] h-[3px] bg-[#2563eb] z-20" />}
                            {m.tapajuntas?.bottom && <div className="absolute -bottom-[5px] -left-[5px] -right-[5px] h-[3px] bg-[#2563eb] z-20" />}
                            {m.tapajuntas?.left && <div className="absolute -left-[5px] -top-[5px] -bottom-[5px] w-[3px] bg-[#2563eb] z-20" />}
                            {m.tapajuntas?.right && <div className="absolute -right-[5px] -top-[5px] -bottom-[5px] w-[3px] bg-[#2563eb] z-20" />}

                            <div 
                              className="w-full h-full grid gap-[1px] bg-[#1e293b]"
                              style={{ 
                                gridTemplateColumns: cRatios.map(r => `${r}fr`).join(' '),
                                gridTemplateRows: rRatios.map(r => `${r}fr`).join(' ')
                              }}
                            >
                              {m.modules.map((mod, i) => (
                                <div key={i} className="bg-white flex items-center justify-center overflow-hidden" style={{ gridColumn: mod.x - minX + 1, gridRow: mod.y - minY + 1 }}>
                                  <div className="w-full h-full scale-[0.8]">
                                    {OPENING_TYPES.find(t => t.id === mod.typeId)?.icon}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>

                  {/* DETALLES */}
                  <div className="flex-1 grid grid-cols-3 gap-x-4 gap-y-1 py-1">
                    <div className="col-span-3 border-b border-slate-50 pb-1 mb-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-slate-900 text-white flex items-center justify-center rounded font-black text-[8px]">{idx + 1}</div>
                          <span className="text-[9px] font-black text-slate-800 uppercase tracking-tight truncate max-w-[200px]">
                            {m.modules.length > 1 ? 'CONJUNTO ARISTA' : OPENING_TYPES.find(t => t.id === m.modules[0].typeId)?.name}
                          </span>
                        </div>
                        <div className="bg-[#1e293b] text-white px-1.5 py-0.5 rounded font-black text-[8px] uppercase">{m.code || 'S/C'}</div>
                      </div>
                      {m.modules.length > 1 && (
                        <p className="text-[6px] font-bold text-[#0078D4] uppercase tracking-wider mt-0.5 ml-6 italic opacity-80">
                          Compuesto por: {componentsText}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[6px] font-black text-slate-300 uppercase tracking-widest">Medida</span>
                      <span className="text-[10px] font-bold text-slate-700 leading-none">{m.width} x {m.height} mm</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[6px] font-black text-slate-300 uppercase tracking-widest">Ubicación</span>
                      <span className="text-[9px] font-bold text-slate-600 uppercase truncate leading-none">{m.location || 'S/U'}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[6px] font-black text-blue-400 uppercase tracking-widest">Vidrio</span>
                      <span className="text-[9px] font-black text-blue-700 uppercase leading-none truncate">{m.glass || 'A DEFINIR'}</span>
                    </div>

                    <div className="col-span-3 flex gap-3 mt-1 pt-1 border-t border-slate-50">
                      <div className="flex flex-col flex-1">
                         <span className="text-[6px] font-black text-slate-300 uppercase block leading-none">Tapajuntas</span>
                         <div className="flex flex-wrap gap-1 mt-0.5">
                          {m.tapajuntas && (m.tapajuntas.top || m.tapajuntas.bottom || m.tapajuntas.left || m.tapajuntas.right) ? (
                            (['top', 'bottom', 'left', 'right'] as const).filter(s => m.tapajuntas[s]).map(s => (
                              <span key={s} className="bg-blue-50 text-blue-600 px-1 py-0.2 rounded text-[5px] font-black border border-blue-100 uppercase">
                                {s === 'top' ? 'SUP' : s === 'bottom' ? 'INF' : s === 'left' ? 'IZQ' : 'DER'}
                              </span>
                            ))
                          ) : <span className="text-[5px] text-slate-200 font-bold uppercase">Sin Tapajuntas</span>}
                         </div>
                      </div>
                      
                      {(cols > 1 || rows > 1) && (
                        <div className="flex-2 flex gap-2">
                          {cols > 1 && (
                            <div>
                              <span className="text-[5px] font-black text-slate-300 uppercase block leading-none">Anchos</span>
                              <div className="flex gap-1 mt-0.5">
                                {partialWidths.map((pw, i) => (
                                  <span key={i} className="text-[7px] font-bold text-slate-500 tabular-nums">H{i+1}:{pw}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {rows > 1 && (
                            <div>
                              <span className="text-[5px] font-black text-slate-300 uppercase block leading-none">Altos</span>
                              <div className="flex gap-1 mt-0.5">
                                {partialHeights.map((ph, i) => (
                                  <span key={i} className="text-[7px] font-bold text-slate-500 tabular-nums">F{i+1}:{ph}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Notas/Detalles del usuario en el reporte */}
                {m.notes && (
                  <div className="px-2 py-1 bg-slate-50 rounded border-l-2 border-slate-200 mt-1">
                    <p className="text-[7px] font-bold text-slate-500 uppercase italic">
                      Observaciones: <span className="font-medium normal-case text-slate-600 tracking-normal">{m.notes}</span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Ultra-Mini */}
        <div className="mt-4 pt-2 border-t border-slate-100 flex justify-between items-center text-slate-300">
           <span className="text-[6px] font-black uppercase tracking-[0.2em]">ARISTA ESTUDIO • SISTEMA TÉCNICO</span>
           <span className="text-[6px] font-bold uppercase tracking-widest">Documento de Obra</span>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
