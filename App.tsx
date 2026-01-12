
import React, { useState, useEffect } from 'react';
import { Project, Measurement } from './types';
import Dashboard from './components/Dashboard';
import ProjectView from './components/ProjectView';
import MeasurementEditor from './components/MeasurementEditor';
import ReportView from './components/ReportView';
import Auth from './components/Auth';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

/* 
💡 NOTA PARA EL ADMINISTRADOR:
Si ves errores de columnas faltantes, ejecuta este SQL en el "SQL Editor" de tu Dashboard de Supabase:

ALTER TABLE projects ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS color text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS line text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS glass text;
*/

type ViewState = 
  | { type: 'dashboard' }
  | { type: 'project', projectId: string }
  | { type: 'edit-measurement', projectId: string, measurementId?: string }
  | { type: 'report', projectId: string };

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [view, setView] = useState<ViewState>({ type: 'dashboard' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProjects();
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProjects();
      else {
        setProjects([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Intentamos una carga limpia. Si fallan las columnas específicas, Supabase nos avisará.
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Aviso de Base de Datos:", error.message);
        // Si el error es específicamente por user_id, podrías reintentar sin filtro si fuera necesario.
        throw error;
      }
      
      if (data) {
        const normalizedData = data.map((item: any) => {
          // Si los datos no están en columnas raíz, buscamos en el JSON de measurements como fallback
          const meta = item.measurements?.meta || {};
          return {
            ...item,
            id: item.id?.toString(),
            address: item.address || meta.address || '',
            color: item.color || meta.color || '',
            line: item.line || meta.line || '',
            glass: item.glass || meta.glass || '',
            measurements: Array.isArray(item.measurements) ? item.measurements : (item.measurements?.items || []),
            createdAt: item.created_at ? new Date(item.created_at).getTime() : Date.now()
          };
        });
        setProjects(normalizedData);
      }
    } catch (err: any) {
      console.error('Error al cargar proyectos:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView({ type: 'dashboard' });
  };

  if (!session) {
    return <Auth />;
  }

  const navigateToDashboard = () => setView({ type: 'dashboard' });
  const navigateToProject = (id: string) => setView({ type: 'project', projectId: id });
  const navigateToNewMeasurement = (projectId: string) => setView({ type: 'edit-measurement', projectId });
  const navigateToEditMeasurement = (projectId: string, mId: string) => setView({ type: 'edit-measurement', projectId, measurementId: mId });
  const navigateToReport = (projectId: string) => setView({ type: 'report', projectId });

  const addProject = async (name: string, client: string, address: string, color: string, line: string, glass: string) => {
    const tempId = Math.random().toString(36).substr(2, 9);
    
    // Objeto compatible con una tabla que podría no tener todas las columnas
    const projectToInsert: any = {
      id: tempId,
      name,
      client,
      // Metemos los datos extra en el JSON por si las columnas raíz no existen
      measurements: {
        meta: { address, color, line, glass },
        items: []
      }
    };

    try {
      // Intentamos insertar. Si falla por columnas, el error será capturado.
      const { data, error } = await supabase.from('projects').insert([projectToInsert]).select();
      
      if (error) {
        console.error("Error al insertar, intentando modo compatible...", error.message);
        // Fallback: Si 'address' u otros fallan, intentamos insertar solo lo básico
        const basicInsert = { id: tempId, name, client, measurements: { meta: { address, color, line, glass }, items: [] } };
        const { data: d2, error: e2 } = await supabase.from('projects').insert([basicInsert]).select();
        if (e2) throw e2;
        
        const newProject: Project = { ...basicInsert, address, color, line, glass, measurements: [], createdAt: Date.now() };
        setProjects([newProject, ...projects]);
        navigateToProject(newProject.id);
      } else {
        const saved = data?.[0];
        const newProject: Project = {
          ...projectToInsert,
          address, color, line, glass,
          measurements: [],
          createdAt: saved?.created_at ? new Date(saved.created_at).getTime() : Date.now()
        };
        setProjects([newProject, ...projects]);
        navigateToProject(newProject.id);
      }
    } catch (err: any) {
      alert("Error crítico de base de datos. Por favor, revisa que la tabla 'projects' tenga las columnas: id, name, client, measurements.");
    }
  };

  const deleteProject = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este proyecto definitivamente?')) {
      try {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) throw error;
        setProjects(projects.filter(p => p.id !== id));
        navigateToDashboard();
      } catch (err: any) {
        console.error('Error al eliminar:', err.message);
      }
    }
  };

  const saveMeasurement = async (projectId: string, measurement: Omit<Measurement, 'id' | 'createdAt'>, mId?: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const currentItems = Array.isArray(project.measurements) ? project.measurements : [];
    let newItems = [...currentItems];
    
    if (mId) {
      const idx = newItems.findIndex(m => m.id === mId);
      newItems[idx] = { ...newItems[idx], ...measurement };
    } else {
      newItems.push({
        ...measurement,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: Date.now()
      });
    }

    // Mantener los metadatos al actualizar el JSON
    const payload = {
      meta: { address: project.address, color: project.color, line: project.line, glass: project.glass },
      items: newItems
    };

    try {
      const { error } = await supabase
        .from('projects')
        .update({ measurements: payload })
        .eq('id', projectId);
      
      if (error) throw error;
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, measurements: newItems } : p));
      navigateToProject(projectId);
    } catch (err: any) {
      console.error('Error al guardar medida:', err.message);
    }
  };

  const deleteMeasurement = async (projectId: string, mId: string) => {
    if (confirm('¿Eliminar esta medida?')) {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;
      const filteredItems = project.measurements.filter(m => m.id !== mId);
      const payload = {
        meta: { address: project.address, color: project.color, line: project.line, glass: project.glass },
        items: filteredItems
      };
      try {
        const { error } = await supabase.from('projects').update({ measurements: payload }).eq('id', projectId);
        if (error) throw error;
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, measurements: filteredItems } : p));
      } catch (err: any) {
        console.error('Error al eliminar medida:', err.message);
      }
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse text-slate-400">
          <div className="w-12 h-12 bg-slate-200 rounded-full mb-4"></div>
          <p className="text-xs font-black uppercase tracking-widest">Sincronizando con Arista Cloud...</p>
        </div>
      );
    }

    switch (view.type) {
      case 'dashboard':
        return <Dashboard projects={projects} onAddProject={addProject} onSelectProject={navigateToProject} />;
      case 'project':
        const project = projects.find(p => p.id === view.projectId);
        if (!project) return <div className="p-10 text-center">Proyecto no encontrado.</div>;
        return (
          <ProjectView 
            project={project} 
            onBack={navigateToDashboard}
            onAddMeasurement={() => navigateToNewMeasurement(project.id)}
            onEditMeasurement={(mId) => navigateToEditMeasurement(project.id, mId)}
            onDeleteMeasurement={(mId) => deleteMeasurement(project.id, mId)}
            onDeleteProject={() => deleteProject(project.id)}
            onViewReport={() => navigateToReport(project.id)}
          />
        );
      case 'edit-measurement':
        return (
          <MeasurementEditor 
            measurement={projects.find(p => p.id === view.projectId)?.measurements.find(m => m.id === view.measurementId)}
            onSave={(data) => saveMeasurement(view.projectId, data, view.measurementId)}
            onCancel={() => navigateToProject(view.projectId)}
          />
        );
      case 'report':
        const rProject = projects.find(p => p.id === view.projectId);
        return rProject ? <ReportView project={rProject} onBack={() => navigateToProject(rProject.id)} /> : null;
      default:
        return <div>404</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start no-print z-50 sticky top-0 md:relative">
        <div className="p-4 md:p-6 flex flex-col gap-1">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#0078D4] rounded-lg md:rounded-xl flex items-center justify-center text-white font-black text-lg md:text-xl shadow-lg shadow-blue-200">A</div>
            <div>
              <h1 className="text-sm md:text-lg font-black text-slate-800 leading-none tracking-tight">ARISTA<span className="text-[#0078D4]">ESTUDIO</span></h1>
              <p className="text-[8px] md:text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-0.5 md:mt-1">Medidor Cloud</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 w-full md:flex flex-row md:flex-col gap-1 md:gap-2 p-2 md:p-4">
          <button 
            onClick={navigateToDashboard}
            className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-sm transition-all w-full text-left ${view.type === 'dashboard' ? 'bg-[#eef6ff] text-[#0078D4]' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Proyectos
          </button>
        </nav>

        <div className="p-4 w-full border-t border-slate-50 mt-auto hidden md:block">
          <div className="mb-4">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Sesión Activa</p>
            <p className="text-[10px] font-bold text-slate-600 truncate">{session?.user?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full py-3 bg-slate-50 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all"
          >
            Cerrar Sesión
          </button>
        </div>

        <button onClick={handleLogout} className="md:hidden p-4 text-slate-300">
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-5xl mx-auto">
        <div className="mb-6 md:mb-8 no-print flex justify-between items-center">
          <div>
            <h2 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight">
              {view.type === 'dashboard' ? 'Presupuestador' : 'Detalle'}
            </h2>
            <p className="text-slate-400 font-medium text-[10px] md:text-sm mt-0.5">Gestión técnica sincronizada</p>
          </div>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
