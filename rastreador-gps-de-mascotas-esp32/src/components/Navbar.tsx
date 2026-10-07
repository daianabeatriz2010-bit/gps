import React from 'react';
import { 
  MapPin, 
  AlertCircle, 
  Code2, 
  Rocket, 
  GraduationCap, 
  Cpu, 
  Radio,
  RefreshCw
} from 'lucide-react';

export type TabType = 'map' | 'diagnostics' | 'code' | 'deploy' | 'presentation' | 'hardware';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  serverStatus: 'online' | 'empty' | 'sleeping' | 'offline';
  isChecking: boolean;
  onRefresh: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  serverStatus,
  isChecking,
  onRefresh
}) => {
  const getStatusBadge = () => {
    switch (serverStatus) {
      case 'online':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            GPS Activo y Transmitiendo
          </span>
        );
      case 'empty':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Render Despierto (Sin GPS aún)
          </span>
        );
      case 'sleeping':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
            Despertando Servidor...
          </span>
        );
      case 'offline':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Servidor Desconectado
          </span>
        );
    }
  };

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'map', label: 'Mapa en Vivo', icon: <MapPin className="w-4 h-4" /> },
    { id: 'diagnostics', label: 'Diagnóstico del Fallo', icon: <AlertCircle className="w-4 h-4" />, badge: 'Clave' },
    { id: 'code', label: 'Código Corregido', icon: <Code2 className="w-4 h-4" /> },
    { id: 'deploy', label: 'Desplegar Web', icon: <Rocket className="w-4 h-4" /> },
    { id: 'presentation', label: 'Exposición Escolar', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'hardware', label: 'Cableado y Pines', icon: <Cpu className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-xl">
              🐾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-100 text-lg leading-tight tracking-tight">
                  Rastreador GPS de Mascotas
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-indigo-950 text-indigo-300 border border-indigo-700/50 rounded">
                  ESP32 + NEO-6M
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span>Proyecto de Robótica Escolar</span>
                <span className="text-slate-600">•</span>
                <span className="text-indigo-400">Paraguay 🇵🇾</span>
              </p>
            </div>
          </div>

          {/* Status Badge & Refresh */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center">
              {getStatusBadge()}
            </div>
            <button
              onClick={onRefresh}
              title="Comprobar servidor en Render ahora"
              disabled={isChecking}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1.5 text-xs font-medium"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-indigo-400' : ''}`} />
              <span className="hidden sm:inline">{isChecking ? 'Probando...' : 'Probar'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none border-t border-slate-800/80 pt-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 relative ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-indigo-900 text-indigo-200' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
