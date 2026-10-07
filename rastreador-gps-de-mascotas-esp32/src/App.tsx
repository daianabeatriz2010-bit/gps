/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { LiveMap } from './components/LiveMap';
import { Diagnostics } from './components/Diagnostics';
import { CodeViewer } from './components/CodeViewer';
import { DeploymentGuide } from './components/DeploymentGuide';
import { SchoolPresentation } from './components/SchoolPresentation';
import { HardwareSchematic } from './components/HardwareSchematic';
import { GpsLocation, DEFAULT_ASUNCION_LOCATIONS } from './data/sampleLocations';

const RENDER_API_URL = 'https://rastreador-gps-v4ww.onrender.com/datos';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('map');
  const [serverStatus, setServerStatus] = useState<'online' | 'empty' | 'sleeping' | 'offline'>('empty');
  const [currentLocation, setCurrentLocation] = useState<GpsLocation | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isLiveMode, setIsLiveMode] = useState<boolean>(true);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);

  // Función para consultar el servidor de Render
  const consultarServidor = useCallback(async () => {
    setIsChecking(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const response = await fetch(RENDER_API_URL, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(timeoutId);

      setLastCheckTime(new Date());

      if (!response.ok) {
        setServerStatus('offline');
        return;
      }

      const data = await response.json();

      if (data && data.lat !== null && data.lng !== null && !isNaN(Number(data.lat)) && !isNaN(Number(data.lng))) {
        setServerStatus('online');
        setCurrentLocation({
          lat: Number(data.lat),
          lng: Number(data.lng),
          hora: data.hora || new Date().toISOString(),
          satellites: data.sat || 8,
          speedKmh: data.speed || 0.0,
          accuracyM: 2.8,
          source: 'real'
        });
      } else {
        // El servidor respondió correctamente pero sin coordenadas aún
        setServerStatus('empty');
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setServerStatus('sleeping'); // Render puede estar en cold start
      } else {
        setServerStatus('offline');
      }
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Polling automático cada 4 segundos
  useEffect(() => {
    consultarServidor();
    const interval = setInterval(consultarServidor, 4000);
    return () => clearInterval(interval);
  }, [consultarServidor]);

  // Función para enviar una coordenada de prueba a Render
  const handleSendTestCoord = async (lat: number, lng: number): Promise<boolean> => {
    try {
      const resp = await fetch('https://rastreador-gps-v4ww.onrender.com/ubicacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, sat: 9, speed: 4.5 })
      });
      if (resp.ok) {
        setCurrentLocation({
          lat,
          lng,
          hora: new Date().toISOString(),
          satellites: 9,
          speedKmh: 4.5,
          accuracyM: 2.5,
          source: 'real'
        });
        setServerStatus('online');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Barra de navegación superior */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        serverStatus={serverStatus}
        isChecking={isChecking}
        onRefresh={consultarServidor}
      />

      {/* Contenido principal según la pestaña activa */}
      <main className="flex-1 w-full">
        {activeTab === 'map' && (
          <LiveMap
            currentLocation={currentLocation}
            serverStatus={serverStatus}
            isLiveMode={isLiveMode}
            setIsLiveMode={setIsLiveMode}
            onSendTestCoord={handleSendTestCoord}
          />
        )}

        {activeTab === 'diagnostics' && (
          <Diagnostics
            onSendTestCoord={handleSendTestCoord}
            isChecking={isChecking}
            onRefresh={consultarServidor}
            serverUrl={RENDER_API_URL}
          />
        )}

        {activeTab === 'code' && (
          <CodeViewer />
        )}

        {activeTab === 'deploy' && (
          <DeploymentGuide />
        )}

        {activeTab === 'presentation' && (
          <SchoolPresentation />
        )}

        {activeTab === 'hardware' && (
          <HardwareSchematic />
        )}
      </main>

      {/* Pie de página sutil */}
      <footer className="bg-slate-950 border-t border-slate-900 py-4 px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>🐾 Rastreador GPS de Mascotas con ESP32 &amp; NEO-6M</span>
            <span>•</span>
            <span className="text-slate-400">Proyecto de Ciencias y Robótica (Paraguay 🇵🇾)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Servidor: <code className="text-indigo-400 font-mono">rastreador-gps-v4ww.onrender.com</code></span>
            <span>•</span>
            <span>Leaflet + OpenStreetMap</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
