
import React, { useState, useMemo, useEffect } from 'react';
import { Measurement, OpeningTypeId, TapajuntasConfig, MeasurementModule } from '../types';
import { OPENING_TYPES } from '../constants';

interface MeasurementEditorProps {
  measurement?: Measurement;
  onSave: (data: Omit<Measurement, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const MeasurementEditor: React.FC<MeasurementEditorProps> = ({ measurement, onSave, onCancel }) => {
  const [modules, setModules] = useState<MeasurementModule[]>(measurement?.modules || []);
  const [code, setCode] = useState(measurement?.code || '');
  const [width, setWidth] = useState(measurement?.width?.toString() || '800');
  const [height, setHeight] = useState(measurement?.height?.toString() || '1200');
  const [location, setLocation] = useState(measurement?.location || '');
  const [glass, setGlass] = useState(measurement?.glass || '');
  const [notes, setNotes] = useState(measurement?.notes || '');
  const [tapajuntas, setTapajuntas] = useState<TapajuntasConfig>(measurement?.tapajuntas || {
    top: false, bottom: false, left: false, right: false
  });
  
  const [rowRatios, setRowRatios] = useState<number[]>(measurement?.rowRatios || []);
  const [colRatios, setColRatios] = useState<number[]>(measurement?.colRatios || []);

  const [pickerPosition, setPickerPosition] = useState<{x: number, y: number} | null>(measurement ? null : {x: 0, y: 0});

  const bounds = useMemo(() => {
    if (modules.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0, cols: 1, rows: 1 };
    const xs = modules.map(m => m.x);
    const ys = modules.map(m => m.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    return { minX, maxX, minY, maxY, cols: maxX - minX + 1, rows: maxY - minY + 1 };
  }, [modules]);

  useEffect(() => {
    if (rowRatios.length !== bounds.rows) {
      setRowRatios(Array(bounds.rows).fill(1));
    }
    if (colRatios.length !== bounds.cols) {
      setColRatios(Array(bounds.cols).fill(1));
    }
  }, [bounds.rows, bounds.cols]);

  const addModuleAt = (typeId: OpeningTypeId, x: number, y: number) => {
    if (modules.some(m => m.x === x && m.y === y)) return;
    setModules([...modules, { typeId, x, y }]);
    setPickerPosition(null);
  };

  const removeModule = (index: number) => {
    if (modules.length <= 1) {
      setModules([]);
      setPickerPosition({x: 0, y: 0});
      return;
    }
    const newModules = [...modules];
    newModules.splice(index, 1);
    setModules(newModules);
  };

  const safeWidth = Math.max(1, Number(width) || 1);
  const safeHeight = Math.max(1, Number(height) || 1);

  const colWidths = useMemo(() => {
    const totalRatio = colRatios.reduce((a, b) => a + b, 0) || 1;
    return colRatios.map(r => Math.round((r / totalRatio) * safeWidth));
  }, [colRatios, safeWidth]);

  const rowHeights = useMemo(() => {
    const totalRatio = rowRatios.reduce((a, b) => a + b, 0) || 1;
    return rowRatios.map(r => Math.round((r / totalRatio) * safeHeight));
  }, [rowRatios, safeHeight]);

  const handleColWidthChange = (index: number, newVal: string) => {
    const targetVal = parseFloat(newVal) || 0;
    const totalW = safeWidth;
    if (totalW <= 0) return;
    const newRatios = [...colRatios];
    if (colRatios.length === 2) {
      const otherIndex = index === 0 ? 1 : 0;
      newRatios[index] = targetVal;
      newRatios[otherIndex] = Math.max(1, totalW - targetVal);
    } else {
      newRatios[index] = targetVal;
      const remainingWidth = totalW - targetVal;
      const currentOthersSum = colWidths.reduce((acc, curr, idx) => idx === index ? acc : acc + curr, 0) || 1;
      colRatios.forEach((_, idx) => {
        if (idx !== index) {
          const proportion = colWidths[idx] / currentOthersSum;
          newRatios[idx] = Math.max(1, remainingWidth * proportion);
        }
      });
    }
    setColRatios(newRatios);
  };

  const handleRowHeightChange = (index: number, newVal: string) => {
    const targetVal = parseFloat(newVal) || 0;
    const totalH = safeHeight;
    if (totalH <= 0) return;
    const newRatios = [...rowRatios];
    if (rowRatios.length === 2) {
      const otherIndex = index === 0 ? 1 : 0;
      newRatios[index] = targetVal;
      newRatios[otherIndex] = Math.max(1, totalH - targetVal);
    } else {
      newRatios[index] = targetVal;
      const remainingHeight = totalH - targetVal;
      const currentOthersSum = rowHeights.reduce((acc, curr, idx) => idx === index ? acc : acc + curr, 0) || 1;
      rowRatios.forEach((_, idx) => {
        if (idx !== index) {
          const proportion = rowHeights[idx] / currentOthersSum;
          newRatios[idx] = Math.max(1, remainingHeight * proportion);
        }
      });
    }
    setRowRatios(newRatios);
  };

  const handleSave = () => {
    if (modules.length === 0) return alert('Selecciona una abertura');
    onSave({
      modules,
      code: code || 'S/C',
      width: parseInt(width, 10) || 0,
      height: parseInt(height, 10) || 0,
      location,
      color: '',
      glass,
      tapajuntas,
      notes,
      rowRatios,
      colRatios
    });
  };

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom duration-500 max-w-5xl mx-auto pb-10 px-2 md:px-4">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#0078D4] rounded-lg flex items-center justify-center text-white shadow-lg">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" /></svg>
          </div>
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none">Dibujo Técnico</h3>
        </div>
        <button onClick={onCancel} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-black hover:bg-slate-200 transition-colors">×</button>
      </div>

      <div className="bg-white p-4 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6 md:space-y-8 overflow-hidden">
        
        <div className="w-full h-[350px] md:h-[550px] bg-[#fafbfc] rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center relative overflow-visible border border-slate-50">
            <div className="relative w-full h-full max-w-[85%] max-h-[85%] flex items-center justify-center overflow-visible">
                
                {/* Cotas Dinámicas Totales */}
                <div className="absolute -top-8 md:-top-12 left-0 right-0 flex items-center z-10 px-2 md:px-4">
                    <div className="h-[1px] bg-slate-300 flex-1"></div>
                    <span className="mx-2 md:mx-4 text-slate-400 font-black text-[9px] md:text-[11px] tabular-nums whitespace-nowrap">{width} mm</span>
                    <div className="h-[1px] bg-slate-300 flex-1"></div>
                </div>

                <div className="absolute -right-8 md:-right-16 top-0 bottom-0 flex flex-col items-center justify-center z-10 py-2 md:py-4">
                    <div className="w-[1px] bg-slate-300 flex-1"></div>
                    <span className="my-2 md:my-4 text-slate-400 font-black text-[9px] md:text-[11px] [writing-mode:vertical-lr] tabular-nums whitespace-nowrap">{height} mm</span>
                    <div className="w-[1px] bg-slate-300 flex-1"></div>
                </div>

                {/* Contenedor Adaptativo */}
                <div 
                  className="relative pointer-events-auto transition-all duration-300 overflow-visible flex flex-col items-center"
                  style={{
                    aspectRatio: `${safeWidth} / ${safeHeight}`,
                    width: safeWidth >= safeHeight ? '100%' : 'auto',
                    height: safeWidth < safeHeight ? '100%' : 'auto'
                  }}
                >
                    <div className="relative w-full h-full flex items-center justify-center overflow-visible">
                        {/* Medidas individuales IZQUIERDA */}
                        {bounds.rows > 1 && (
                          <div 
                            className="absolute -left-10 md:-left-12 top-0 bottom-0 grid gap-[4px] z-30 py-[6px]"
                            style={{ gridTemplateRows: rowRatios.map(r => `${r}fr`).join(' ') }}
                          >
                            {rowHeights.map((h, idx) => (
                              <div key={idx} className="flex items-center justify-end">
                                <div className="bg-[#1e293b] text-white px-1 py-0.5 rounded text-[6px] md:text-[7px] font-black tabular-nums shadow-sm whitespace-nowrap">
                                  {h}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Marco Principal */}
                        <div className="w-full h-full relative bg-white border-[4px] md:border-[6px] border-[#1e293b] shadow-2xl z-10 overflow-visible">
                            {tapajuntas.top && <div className="absolute -top-[10px] -left-[10px] -right-[10px] h-[8px] bg-[#2563eb] z-20" />}
                            {tapajuntas.bottom && <div className="absolute -bottom-[10px] -left-[10px] -right-[10px] h-[8px] bg-[#2563eb] z-20" />}
                            {tapajuntas.left && <div className="absolute -left-[10px] -top-[10px] -bottom-[10px] w-[8px] bg-[#2563eb] z-20" />}
                            {tapajuntas.right && <div className="absolute -right-[10px] -top-[10px] -bottom-[10px] w-[8px] bg-[#2563eb] z-20" />}

                            <div 
                              className="w-full h-full grid gap-[2px] md:gap-[4px] bg-[#1e293b]"
                              style={{ 
                                gridTemplateColumns: colRatios.length ? colRatios.map(r => `${r}fr`).join(' ') : '1fr',
                                gridTemplateRows: rowRatios.length ? rowRatios.map(r => `${r}fr`).join(' ') : '1fr'
                              }}
                            >
                                {modules.map((m, idx) => (
                                  <div 
                                    key={`${m.x}-${m.y}`} 
                                    className="bg-white flex items-center justify-center relative group/mod overflow-hidden"
                                    style={{ gridColumn: m.x - bounds.minX + 1, gridRow: m.y - bounds.minY + 1 }}
                                  >
                                    <div className="w-full h-full">{OPENING_TYPES.find(t => t.id === m.typeId)?.icon}</div>
                                    
                                    <ExpansionHandle x={m.x} y={m.y-1} dir="top" modules={modules} onSelect={() => setPickerPosition({x: m.x, y: m.y-1})} />
                                    <ExpansionHandle x={m.x} y={m.y+1} dir="bottom" modules={modules} onSelect={() => setPickerPosition({x: m.x, y: m.y+1})} />
                                    <ExpansionHandle x={m.x-1} y={m.y} dir="left" modules={modules} onSelect={() => setPickerPosition({x: m.x-1, y: m.y})} />
                                    <ExpansionHandle x={m.x+1} y={m.y} dir="right" modules={modules} onSelect={() => setPickerPosition({x: m.x+1, y: m.y})} />
                                    
                                    <button onClick={(e) => {e.stopPropagation(); removeModule(idx);}} className="absolute top-1 right-1 w-6 h-6 md:w-8 md:h-8 bg-red-500 text-white rounded-full opacity-0 group-hover/mod:opacity-100 z-50 font-black text-xs md:text-sm flex items-center justify-center shadow-lg transition-all active:scale-90">×</button>
                                  </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Medidas individuales ABAJO */}
                    {bounds.cols > 1 && (
                      <div 
                        className="w-full grid gap-[4px] mt-2 z-30"
                        style={{ gridTemplateColumns: colRatios.map(r => `${r}fr`).join(' ') }}
                      >
                        {colWidths.map((w, idx) => (
                          <div key={idx} className="flex justify-center">
                            <div className="bg-[#1e293b] text-white px-1.5 py-0.5 rounded text-[6px] md:text-[8px] font-black tabular-nums shadow-sm whitespace-nowrap">
                              {w} mm
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>

                <div className="flex flex-col items-center gap-1 md:gap-2 mt-10 md:mt-12">
                   <span className="text-[8px] md:text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase leading-none">CÓDIGO REF.</span>
                   <div className="px-3 md:px-5 py-1.5 md:py-2 bg-[#1e293b] text-white font-black text-[10px] md:text-[12px] rounded-lg shadow-lg min-w-[50px] md:min-w-[70px] text-center">
                     {code || 'S/C'}
                   </div>
                </div>
            </div>
        </div>

        {/* Panel de Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-1 md:px-2">
            <div className="space-y-4">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                 <div className="w-1 h-1 bg-[#0078D4] rounded-full"></div>
                 Medidas Totales (mm)
              </label>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                 <div className="relative">
                   <input type="number" className="w-full pl-10 md:pl-16 pr-3 md:pr-4 py-3 md:py-4 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#0078D4] outline-none font-black text-sm md:text-lg text-right" value={width} onChange={(e) => setWidth(e.target.value)} />
                   <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[7px] md:text-[9px] font-black text-slate-300 uppercase">ANCHO</span>
                 </div>
                 <div className="relative">
                   <input type="number" className="w-full pl-10 md:pl-16 pr-3 md:pr-4 py-3 md:py-4 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#0078D4] outline-none font-black text-sm md:text-lg text-right" value={height} onChange={(e) => setHeight(e.target.value)} />
                   <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[7px] md:text-[9px] font-black text-slate-300 uppercase">ALTO</span>
                 </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                 <div className="w-1 h-1 bg-[#0078D4] rounded-full"></div>
                 Especificaciones
              </label>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                 <input className="p-3 md:p-4 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#0078D4] outline-none font-black uppercase text-[10px] md:text-xs" placeholder="CÓDIGO" value={code} onChange={(e) => setCode(e.target.value)} />
                 <input className="p-3 md:p-4 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#0078D4] outline-none font-black text-[10px] md:text-xs uppercase" placeholder="VIDRIO" value={glass} onChange={(e) => setGlass(e.target.value)} />
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                 <div className="w-1 h-1 bg-[#0078D4] rounded-full"></div>
                 Detalles / Notas Adicionales
              </label>
              <textarea 
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#0078D4] outline-none font-medium text-[10px] md:text-xs uppercase min-h-[80px] resize-none"
                placeholder="ESCRIBE AQUÍ DETALLES PERTINENTES DE LA ABERTURA..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {bounds.cols > 1 && (
              <div className="md:col-span-2 space-y-4 bg-blue-50/20 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-blue-50">
                <label className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2 block">División de Anchos</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                  {colWidths.map((w, idx) => (
                    <div key={idx} className="relative group">
                      <input 
                        type="number" 
                        className="w-full pl-10 md:pl-16 pr-3 md:pr-4 py-2.5 md:py-3 bg-white border-2 border-blue-100 rounded-xl md:rounded-2xl focus:border-[#0078D4] outline-none font-black text-xs md:text-sm text-right text-blue-700 shadow-sm" 
                        value={w} 
                        onChange={(e) => handleColWidthChange(idx, e.target.value)} 
                      />
                      <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[7px] md:text-[8px] font-black text-blue-300 uppercase">H{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {bounds.rows > 1 && (
              <div className="md:col-span-2 space-y-4 bg-emerald-50/20 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-emerald-50">
                <label className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-2 block">División de Alturas</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                  {rowHeights.map((h, idx) => (
                    <div key={idx} className="relative group">
                      <input 
                        type="number" 
                        className="w-full pl-10 md:pl-16 pr-3 md:pr-4 py-2.5 md:py-3 bg-white border-2 border-emerald-100 rounded-xl md:rounded-2xl focus:border-emerald-500 outline-none font-black text-xs md:text-sm text-right text-emerald-700 shadow-sm" 
                        value={h} 
                        onChange={(e) => handleRowHeightChange(idx, e.target.value)} 
                      />
                      <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[7px] md:text-[8px] font-black text-emerald-300 uppercase">F{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="md:col-span-2 space-y-4">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Tapajuntas</label>
              <div className="grid grid-cols-2 sm:flex gap-2 md:gap-4">
                {(['top', 'bottom', 'left', 'right'] as const).map(side => (
                  <button
                    key={side}
                    onClick={() => setTapajuntas({...tapajuntas, [side]: !tapajuntas[side]})}
                    className={`py-2.5 md:py-3 px-3 md:px-4 rounded-xl border-2 font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all ${tapajuntas[side] ? 'bg-[#2563eb] border-[#2563eb] text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                  >
                    {side === 'top' ? 'Sup.' : side === 'bottom' ? 'Inf.' : side === 'left' ? 'Izq.' : 'Der.'}
                  </button>
                ))}
              </div>
            </div>
        </div>

        <div className="flex gap-3 md:gap-4 pt-4">
          <button onClick={onCancel} className="px-6 md:px-10 bg-slate-100 text-slate-500 font-black py-3 md:py-4 rounded-xl md:rounded-2xl uppercase text-[9px] md:text-[10px] tracking-widest">Cerrar</button>
          <button onClick={handleSave} className="flex-1 bg-[#0078D4] text-white font-black py-3 md:py-4 rounded-xl md:rounded-2xl shadow-xl hover:bg-[#006cc1] uppercase tracking-[0.2em] text-[9px] md:text-[10px] active:scale-95 transition-all">Guardar</button>
        </div>
      </div>

      {pickerPosition && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-10 max-w-xl w-full shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tipo de abertura</h4>
               <button onClick={() => setPickerPosition(null)} className="text-2xl font-black text-slate-200 hover:text-slate-900">×</button>
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-1">
              {OPENING_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => addModuleAt(type.id, pickerPosition.x, pickerPosition.y)}
                  className="p-4 bg-slate-50 rounded-[1.5rem] border-2 border-transparent hover:border-[#0078D4] transition-all flex flex-col items-center gap-2 group"
                >
                  <div className="w-10 h-10 text-slate-400 group-hover:text-[#0078D4]">{type.icon}</div>
                  <span className="text-[7px] font-black uppercase text-slate-400 group-hover:text-slate-900 text-center leading-tight">{type.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ExpansionHandle: React.FC<{ x: number, y: number, dir: string, modules: MeasurementModule[], onSelect: () => void }> = ({ x, y, dir, modules, onSelect }) => {
  if (modules.some(m => m.x === x && m.y === y)) return null;
  const styles: Record<string, string> = {
    top: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
    bottom: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
    left: "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2",
    right: "right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
  };
  return (
    <button 
      onClick={(e) => { e.stopPropagation(); onSelect(); }} 
      className={`absolute ${styles[dir]} w-10 h-10 md:w-10 md:h-10 bg-white border-2 border-[#1e293b] text-[#1e293b] rounded-full flex items-center justify-center font-black text-2xl opacity-100 md:opacity-0 group-hover/mod:opacity-100 z-50 shadow-xl transition-all active:scale-125 md:hover:scale-125 bg-white`}
    >
      +
    </button>
  );
};

export default MeasurementEditor;
