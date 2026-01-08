
import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Project, Measurement, OpeningTypeId } from './types';
import Dashboard from './components/Dashboard';
import ProjectView from './components/ProjectView';
import MeasurementEditor from './components/MeasurementEditor';
import ReportView from './components/ReportView';

type ViewState = 
  | { type: 'dashboard' }
  | { type: 'project', projectId: string }
  | { type: 'edit-measurement', projectId: string, measurementId?: string }
  | { type: 'report', projectId: string };

const App: React.FC = () => {
  const [projects, setProjects] = useLocalStorage<Project[]>('medidor_pro_projects', []);
  const [view, setView] = useState<ViewState>({ type: 'dashboard' });

  const navigateToDashboard = () => setView({ type: 'dashboard' });
  const navigateToProject = (id: string) => setView({ type: 'project', projectId: id });
  const navigateToNewMeasurement = (projectId: string) => setView({ type: 'edit-measurement', projectId });
  const navigateToEditMeasurement = (projectId: string, mId: string) => setView({ type: 'edit-measurement', projectId, measurementId: mId });
  const navigateToReport = (projectId: string) => setView({ type: 'report', projectId });

  const addProject = (name: string, client: string, address: string, color: string, line: string, glass: string) => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      client,
      address,
      color,
      line,
      glass,
      measurements: [],
      createdAt: Date.now()
    };
    setProjects([newProject, ...projects]);
    navigateToProject(newProject.id);
  };

  const deleteProject = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este proyecto?')) {
      setProjects(projects.filter(p => p.id !== id));
      navigateToDashboard();
    }
  };

  const saveMeasurement = (projectId: string, measurement: Omit<Measurement, 'id' | 'createdAt'>, mId?: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      
      const measurements = [...p.measurements];
      if (mId) {
        const idx = measurements.findIndex(m => m.id === mId);
        measurements[idx] = { ...measurements[idx], ...measurement };
      } else {
        measurements.push({
          ...measurement,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: Date.now()
        });
      }
      return { ...p, measurements };
    }));
    navigateToProject(projectId);
  };

  const deleteMeasurement = (projectId: string, mId: string) => {
    if (confirm('¿Eliminar esta medida?')) {
      setProjects(prev => prev.map(p => {
        if (p.id !== projectId) return p;
        return { ...p, measurements: p.measurements.filter(m => m.id !== mId) };
      }));
    }
  };

  const renderContent = () => {
    switch (view.type) {
      case 'dashboard':
        return <Dashboard projects={projects} onAddProject={addProject} onSelectProject={navigateToProject} />;
      case 'project':
        const project = projects.find(p => p.id === view.projectId);
        if (!project) return <div>Proyecto no encontrado</div>;
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
      {/* Sidebar Desktop / Top Bar Mobile */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start no-print z-50 sticky top-0 md:relative">
        <div className="p-4 md:p-6 flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-[#0078D4] rounded-lg md:rounded-xl flex items-center justify-center text-white font-black text-lg md:text-xl shadow-lg shadow-blue-200">A</div>
          <div>
            <h1 className="text-sm md:text-lg font-black text-slate-800 leading-none tracking-tight">ARISTA<span className="text-[#0078D4]">ESTUDIO</span></h1>
            <p className="text-[8px] md:text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-0.5 md:mt-1">Medidor Med</p>
          </div>
        </div>

        <nav className="flex md:flex flex-row md:flex-col gap-1 md:gap-2 p-2 md:p-4">
          <button 
            onClick={navigateToDashboard}
            className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-sm transition-all ${view.type === 'dashboard' ? 'bg-[#eef6ff] text-[#0078D4]' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Proyectos
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-5xl mx-auto">
        <div className="mb-6 md:mb-8 no-print">
          <h2 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight">
            {view.type === 'dashboard' ? 'Presupuestador' : 'Detalle'}
          </h2>
          <p className="text-slate-400 font-medium text-[10px] md:text-sm mt-0.5">Gestión técnica de aberturas</p>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
