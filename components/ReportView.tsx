
import React from 'react';
import { Project } from '../types';
import { OPENING_TYPES } from '../constants';

interface ReportViewProps {
  project: Project;
  onBack: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ project, onBack }) => {
  const handlePrint = () => window.print();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        let projectSummary = `📋 *PLANILLA TÉCNICA - ARISTA ESTUDIO*\n`;
        projectSummary += `━━━━━━━━━━━━━━━━━━━━━\n`;
        projectSummary += `🏗️ *Proyecto:* ${project.name}\n`;
        projectSummary += `👤 *Cliente:* ${project.client}\n`;
        projectSummary += `📍 *Obra:* ${project.address || 'No especificada'}\n`;
        projectSummary += `🎨 *Línea/Color:* ${project.line || '-'} / ${project.color || '-'}\n`;
        projectSummary += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

        project.measurements.forEach((m, idx) => {
          const typeName = m.modules.length > 1 
            ? 'CONJUNTO' 
            : OPENING_TYPES.find(t => t.id === m.modules[0].typeId)?.name || 'ABERTURA';
          
          projectSummary += `*${idx + 1}. ${m.code || 'S/C'}* - ${typeName}\n`;
          projectSummary += `📐 ${m.width} x ${m.height} mm\n`;
          
          if (m.tapajuntas && (m.tapajuntas.top || m.tapajuntas.bottom || m.tapajuntas.left || m.tapajuntas.right)) {
            const sides = [];
            if (m.tapajuntas.top) sides.push('SUP');
            if (m.tapajuntas.bottom) sides.push('INF');
            if (m.tapajuntas.left) sides.push('IZQ');
            if (m.tapajuntas.right) sides.push('DER');
            projectSummary += `🖼️ Tapajuntas: ${sides.join(', ')}\n`;
          }

          if (m.location) projectSummary += `📍 Ubicación: ${m.location}\n`;
          if (m.glass) projectSummary += `💎 Vidrio: ${m.glass}\n`;
          if (m.notes) projectSummary += `💬 Notas: ${m.notes}\n`;
          projectSummary += `─────────────────────\n`;
        });

        const shareData: ShareData = {
          title: `Reporte Arista - ${project.name}`,
          text: projectSummary,
        };

        const currentUrl = window.location.href;
        if (currentUrl.startsWith('http')) {
          shareData.url = currentUrl;
        }

        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error al compartir:', err);
        }
      }
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-20 px-2">
      <div className="flex justify-between items-center no-print mb-4">
        <button onClick={onBack} className="text-slate-600 font-bold uppercase text-[10px] flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Volver
        </button>
        <div className="flex gap-2">
          <button 
            onClick={handleShare}
            className="bg-white border-2 border-slate-200 text-slate-600 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            Compartir
          </button>
          <button 
            onClick={handlePrint} 
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-xl uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all"
          >
            Imprimir PDF
          </button>
        </div>
      </div>

      <div className="bg-white p-4 md:p-8 border border-slate-100 rounded-[1.5rem] print:p-0 print:border-none print:shadow-none min-h-[297mm] shadow-2xl">
        {/* Header */}
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

        {/* Info Proyecto */}
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

        {/* Lista de Aberturas */}
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

            const hasTapajuntas = m.tapajuntas && (m.tapajuntas.top || m.tapajuntas.bottom || m.tapajuntas.left || m.tapajuntas.right);

            return (
              <div key={m.id} className="avoid-break bg-white p-3 border border-slate-200 rounded-xl flex flex-col gap-2 min-h-[140px] relative">
                <div className="flex flex-row items-center gap-4">
                  {/* ESQUEMA TÉCNICO */}
                  <div className="w-[125px] flex-shrink-0 flex flex-col items-center justify-center relative bg-[#fafbfc] rounded-lg border border-slate-50 py-3">
                    <div className="relative w-full h-full max-w-[70%] max-h-[70%] flex items-center justify-center overflow-visible">
                        {/* Cotas */}
                        <div className="absolute -top-5 left-0 right-0 flex items-center px-1">
                          <div className="h-[0.5px] bg-slate-300 flex-1"></div>
                          <span className="mx-0.5 text-slate-500 font-black text-[6px] tabular-nums">{m.width}</span>
                          <div className="h-[0.5px] bg-slate-300 flex-1"></div>
                        </div>
                        <div className="absolute -right-6 top-0 bottom-0 flex flex-col items-center justify-center py-1">
                          <div className="w-[0.5px] bg-slate-300 flex-1"></div>
                          <span className="my-0.5 text-slate-500 font-black text-[6px] [writing-mode:vertical-lr] tabular-nums">{m.height}</span>
                          <div className="w-[0.5px] bg-slate-300 flex-1"></div>
                        </div>

                        {/* Abertura */}
                        <div 
                          className="relative flex flex-col items-center justify-center" 
                          style={{ 
                            aspectRatio: `${safeW} / ${safeH}`,
                            width: safeW >= safeH ? '100%' : 'auto',
                            height: safeH > safeW ? '100%' : 'auto'
                          }}
                        >
                          <div className="w-full h-full relative bg-white border-[2.5px] border-[#1e293b] overflow-visible">
                            {/* Tapajuntas Visuales - Con borde para impresión BN */}
                            {m.tapajuntas?.top && <div className="absolute -top-[5px] -left-[5px] -right-[5px] h-[5px] bg-[#2563eb] border-b border-white z-20" />}
                            {m.tapajuntas?.bottom && <div className="absolute -bottom-[5px] -left-[5px] -right-[5px] h-[5px] bg-[#2563eb] border-t border-white z-20" />}
                            {m.tapajuntas?.left && <div className="absolute -left-[5px] -top-[5px] -bottom-[5px] w-[5px] bg-[#2563eb] border-r border-white z-20" />}
                            {m.tapajuntas?.right && <div className="absolute -right-[5px] -top-[5px] -bottom-[5px] w-[5px] bg-[#2563eb] border-l border-white z-20" />}

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

                  {/* DETALLES TÉCNICOS */}
                  <div className="flex-1 grid grid-cols-3 gap-x-4 gap-y-1 py-1">
                    <div className="col-span-3 border-b border-slate-100 pb-1 mb-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-slate-900 text-white flex items-center justify-center rounded font-black text-[8px]">{idx + 1}</div>
                          <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight truncate max-w-[200px]">
                            {m.modules.length > 1 ? 'CONJUNTO ARISTA' : OPENING_TYPES.find(t => t.id === m.modules[0].typeId)?.name}
                          </span>
                        </div>
                        <div className="bg-[#1e293b] text-white px-1.5 py-0.5 rounded font-black text-[8px] uppercase">{m.code || 'S/C'}</div>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[6px] font-black text-slate-300 uppercase tracking-widest">Medida</span>
                      <span className="text-[10px] font-bold text-slate-800 leading-none">{m.width} x {m.height} mm</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[6px] font-black text-slate-300 uppercase tracking-widest">Ubicación</span>
                      <span className="text-[9px] font-bold text-slate-700 uppercase truncate leading-none">{m.location || 'S/U'}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[6px] font-black text-blue-400 uppercase tracking-widest">Vidrio</span>
                      <span className="text-[9px] font-black text-blue-700 uppercase leading-none truncate">{m.glass || 'A DEFINIR'}</span>
                    </div>

                    <div className="col-span-3 flex gap-3 mt-1 pt-2 border-t border-slate-50">
                      {/* Tapajuntas Detallado */}
                      <div className="flex flex-col flex-1">
                         <span className="text-[6px] font-black text-slate-400 uppercase block leading-none mb-1">Tapajuntas</span>
                         <div className="flex flex-wrap gap-1">
                          {hasTapajuntas ? (
                            (['top', 'bottom', 'left', 'right'] as const).filter(s => m.tapajuntas[s]).map(s => (
                              <span key={s} className="bg-blue-600 text-white px-2 py-0.5 rounded-[2px] text-[7px] font-extrabold border border-blue-700 uppercase">
                                {s === 'top' ? 'SUPERIOR' : s === 'bottom' ? 'INFERIOR' : s === 'left' ? 'IZQUIERDA' : 'DERECHA'}
                              </span>
                            ))
                          ) : (
                            <span className="text-[6px] text-slate-300 font-bold uppercase">Sin tapajuntas</span>
                          )}
                         </div>
                      </div>
                      
                      {/* Divisiones */}
                      {(cols > 1 || rows > 1) && (
                        <div className="flex-2 flex gap-3">
                          {cols > 1 && (
                            <div>
                              <span className="text-[5px] font-black text-slate-300 uppercase block leading-none">Anchos</span>
                              <div className="flex gap-1 mt-0.5">
                                {partialWidths.map((pw, i) => (
                                  <span key={i} className="text-[7px] font-bold text-slate-600 tabular-nums">H{i+1}:{pw}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {rows > 1 && (
                            <div>
                              <span className="text-[5px] font-black text-slate-300 uppercase block leading-none">Altos</span>
                              <div className="flex gap-1 mt-0.5">
                                {partialHeights.map((ph, i) => (
                                  <span key={i} className="text-[7px] font-bold text-slate-600 tabular-nums">F{i+1}:{ph}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Notas */}
                {m.notes && (
                  <div className="px-3 py-1.5 bg-slate-50 rounded-lg border-l-2 border-slate-200 mt-1">
                    <p className="text-[7px] font-bold text-slate-500 uppercase italic">
                      Observaciones: <span className="font-medium normal-case text-slate-600 tracking-normal">{m.notes}</span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-slate-100 flex justify-between items-center text-slate-300">
           <span className="text-[6px] font-black uppercase tracking-[0.2em]">ARISTA ESTUDIO • SISTEMA TÉCNICO DE MEDICIÓN</span>
           <span className="text-[7px] font-bold uppercase tracking-widest text-slate-400">PÁGINA 1 DE 1</span>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
