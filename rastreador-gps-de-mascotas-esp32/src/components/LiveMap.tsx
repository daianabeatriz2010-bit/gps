import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Crosshair, 
  Shield, 
  ShieldAlert, 
  Navigation, 
  Clock, 
  Radio, 
  Eye, 
  Download,
  Flame,
  Maximize2
} from 'lucide-react';
import { GpsLocation, DEFAULT_ASUNCION_LOCATIONS, STANDALONE_HTML_CODE } from '../data/sampleLocations';

interface LiveMapProps {
  currentLocation: GpsLocation | null;
  serverStatus: 'online' | 'empty' | 'sleeping' | 'offline';
  isLiveMode: boolean;
  setIsLiveMode: (live: boolean) => void;
  onSendTestCoord: (lat: number, lng: number) => void;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  currentLocation,
  serverStatus,
  isLiveMode,
  setIsLiveMode,
  onSendTestCoord
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const geofenceCircleRef = useRef<L.Circle | null>(null);

  // Estados de mascota e interfaz
  const [petName, setPetName] = useState<string>('Tobi');
  const [petType, setPetType] = useState<'dog' | 'cat'>('dog');
  const [safeZoneRadius, setSafeZoneRadius] = useState<number>(200); // 200 metros
  const [safeZoneCenter, setSafeZoneCenter] = useState<[number, number]>([-25.2822, -57.6351]);
  const [isInsideSafeZone, setIsInsideSafeZone] = useState<boolean>(true);
  
  // Historial de coordenadas en la sesión actual
  const [trail, setTrail] = useState<[number, number][]>([]);
  const [simIndex, setSimIndex] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Inicializar mapa de Leaflet
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centro inicial: Asunción, Paraguay
    const initialCoords: [number, number] = currentLocation 
      ? [currentLocation.lat, currentLocation.lng]
      : [-25.2822, -57.6351];

    const map = L.map(mapContainerRef.current, {
      center: initialCoords,
      zoom: 16,
      zoomControl: true
    });

    // OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors | Rastreador GPS Dai'
    }).addTo(map);

    // Línea de recorrido
    const polyline = L.polyline([], {
      color: '#818cf8',
      weight: 4,
      opacity: 0.85,
      dashArray: '4, 8'
    }).addTo(map);

    // Geovalla
    const geofence = L.circle(initialCoords, {
      radius: safeZoneRadius,
      color: '#10b981',
      fillColor: '#10b981',
      fillOpacity: 0.12,
      weight: 2
    }).addTo(map);

    mapInstanceRef.current = map;
    polylineRef.current = polyline;
    geofenceCircleRef.current = geofence;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Función para calcular distancia haversine en metros
  const calcularDistanciaMetros = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Radio de la Tierra en metros
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Crear icono de mascota
  const createPetIcon = (type: 'dog' | 'cat', breached: boolean) => {
    const emoji = type === 'dog' ? '🐶' : '🐱';
    const borderColor = breached ? '#ef4444' : '#6366f1';
    const bgColor = breached ? '#991b1b' : '#312e81';

    return L.divIcon({
      className: 'pet-custom-icon',
      html: `
        <div style="
          width: 42px; 
          height: 42px; 
          background: ${bgColor}; 
          border: 3px solid ${borderColor}; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 20px; 
          box-shadow: 0 4px 14px rgba(0,0,0,0.6);
          position: relative;
          transition: transform 0.3s ease;
        ">
          ${emoji}
          ${breached ? `
            <span style="
              position: absolute; 
              top: -6px; 
              right: -6px; 
              background: #ef4444; 
              color: white; 
              border-radius: 50%; 
              width: 16px; 
              height: 16px; 
              font-size: 10px; 
              font-weight: bold; 
              display: flex; 
              align-items: center; 
              justify-content: center;
              border: 1px solid white;
            ">!</span>` : ''}
        </div>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 21],
      popupAnchor: [0, -22]
    });
  };

  // Actualizar marcador cuando cambia currentLocation o la simulación
  const activeLocation: GpsLocation = (!isLiveMode && DEFAULT_ASUNCION_LOCATIONS[simIndex]) 
    ? DEFAULT_ASUNCION_LOCATIONS[simIndex] 
    : (currentLocation || DEFAULT_ASUNCION_LOCATIONS[0]);

  useEffect(() => {
    if (!mapInstanceRef.current || !activeLocation) return;

    const lat = activeLocation.lat;
    const lng = activeLocation.lng;
    const pos: [number, number] = [lat, lng];

    // Verificar si está dentro de la zona segura
    const dist = calcularDistanciaMetros(safeZoneCenter[0], safeZoneCenter[1], lat, lng);
    const inside = dist <= safeZoneRadius;
    setIsInsideSafeZone(inside);

    // Actualizar o crear marcador
    const icon = createPetIcon(petType, !inside);

    if (!markerRef.current) {
      const marker = L.marker(pos, { icon }).addTo(mapInstanceRef.current);
      markerRef.current = marker;
      mapInstanceRef.current.setView(pos, 16);
    } else {
      markerRef.current.setLatLng(pos);
      markerRef.current.setIcon(icon);
    }

    // Popup
    const popupContent = `
      <div style="font-family: inherit; font-size: 13px; line-height: 1.4; color: #1e293b;">
        <strong style="font-size: 14px; color: #4338ca;">🐾 ${petName}</strong><br>
        <strong>Lat:</strong> ${lat.toFixed(6)}<br>
        <strong>Lng:</strong> ${lng.toFixed(6)}<br>
        <strong>Distancia al refugio:</strong> ${Math.round(dist)} m<br>
        <strong>Estado:</strong> ${inside ? '<span style="color:#059669; font-weight:bold;">Dentro de Zona Segura</span>' : '<span style="color:#dc2626; font-weight:bold;">¡FUERA DE ZONA SEGURA!</span>'}
      </div>
    `;
    markerRef.current.bindPopup(popupContent);

    // Actualizar historial de ruta
    setTrail(prev => {
      const last = prev[prev.length - 1];
      if (!last || last[0] !== lat || last[1] !== lng) {
        const next = [...prev, pos];
        if (polylineRef.current) {
          polylineRef.current.setLatLngs(next);
        }
        return next;
      }
      return prev;
    });

  }, [activeLocation, petType, petName, safeZoneRadius, safeZoneCenter]);

  // Actualizar círculo de geovalla cuando cambie radio o centro
  useEffect(() => {
    if (geofenceCircleRef.current) {
      geofenceCircleRef.current.setRadius(safeZoneRadius);
      geofenceCircleRef.current.setStyle({
        color: isInsideSafeZone ? '#10b981' : '#ef4444',
        fillColor: isInsideSafeZone ? '#10b981' : '#ef4444'
      });
    }
  }, [safeZoneRadius, isInsideSafeZone]);

  // Manejo de la simulación de caminata
  useEffect(() => {
    if (!isSimulating || isLiveMode) return;

    const interval = setInterval(() => {
      setSimIndex(prev => (prev + 1) % DEFAULT_ASUNCION_LOCATIONS.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isSimulating, isLiveMode]);

  // Centrar mapa
  const handleCenter = () => {
    if (mapInstanceRef.current && activeLocation) {
      mapInstanceRef.current.setView([activeLocation.lat, activeLocation.lng], 17, {
        animate: true
      });
      if (markerRef.current) {
        markerRef.current.openPopup();
      }
    }
  };

  // Fijar posición actual como centro de zona segura
  const handleSetSafeCenter = () => {
    if (activeLocation) {
      setSafeZoneCenter([activeLocation.lat, activeLocation.lng]);
      if (geofenceCircleRef.current) {
        geofenceCircleRef.current.setLatLng([activeLocation.lat, activeLocation.lng]);
      }
    }
  };

  // Descargar el archivo standalone
  const handleDownloadStandalone = () => {
    const blob = new Blob([STANDALONE_HTML_CODE], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rastreador-gps-mascotas.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Formato de hora en Paraguay
  const formatearHoraParaguay = (isoStr?: string) => {
    if (!isoStr) return 'Recién';
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString('es-PY', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-8.5rem)] min-h-[580px] flex flex-col lg:flex-row bg-slate-950 overflow-hidden">
      
      {/* SIDEBAR DE CONTROL & TELEMETRÍA */}
      <div className="w-full lg:w-96 bg-slate-900 border-r border-slate-800 flex flex-col overflow-y-auto p-4 gap-4 z-10 shadow-2xl">
        
        {/* Banner de alerta de Zona Segura */}
        {!isInsideSafeZone ? (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 flex items-start gap-3 animate-pulse">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="block text-rose-200 text-sm font-semibold">¡Alerta de Escape!</strong>
              {petName} está fuera del perímetro de seguridad ({safeZoneRadius}m).
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-emerald-200">{petName}</span> está seguro dentro de la geovalla.
            </div>
          </div>
        )}

        {/* Selector de Modo: En Vivo (Render) vs Simulación */}
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Fuente de Datos
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setIsLiveMode(true);
                setIsSimulating(false);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                isLiveMode
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              Render en Vivo
            </button>
            <button
              onClick={() => {
                setIsLiveMode(false);
                setIsSimulating(true);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                !isLiveMode
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Simulador Demo
            </button>
          </div>

          {!isLiveMode && (
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Paseo simulado:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1"
                >
                  {isSimulating ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                  {isSimulating ? 'Pausar' : 'Iniciar'}
                </button>
                <button
                  onClick={() => {
                    setSimIndex(0);
                    setTrail([]);
                  }}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                  title="Reiniciar ruta"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tarjetas de Coordenadas */}
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Coordenadas GPS (WGS84)
            </span>
            <span className="text-[10px] text-indigo-400 font-mono">NEO-6M</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">Latitud</span>
              <span className="font-mono text-sm font-bold text-sky-400 block mt-0.5">
                {activeLocation.lat.toFixed(6)}°
              </span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">Longitud</span>
              <span className="font-mono text-sm font-bold text-sky-400 block mt-0.5">
                {activeLocation.lng.toFixed(6)}°
              </span>
            </div>
          </div>

          {/* Telemetría adicional */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-slate-500" /> Hora (Paraguay):
              </span>
              <span className="font-mono text-slate-200 font-medium">
                {formatearHoraParaguay(activeLocation.hora)}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-slate-500" /> Satélites visibles:
              </span>
              <span className="font-medium text-emerald-400">
                {activeLocation.satellites ?? 9} satélites
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Navigation className="w-3 h-3 text-slate-500" /> Velocidad:
              </span>
              <span className="font-medium text-slate-200">
                {(activeLocation.speedKmh ?? 3.5).toFixed(1)} km/h
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Puntos registrados:</span>
              <span className="font-medium text-indigo-300">
                {trail.length} puntos
              </span>
            </div>
          </div>
        </div>

        {/* Configuración de Mascota y Geovalla */}
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-3">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Ajustes de Perfil
          </span>

          <div className="flex gap-2">
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="Nombre de la mascota"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => setPetType(petType === 'dog' ? 'cat' : 'dog')}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm hover:bg-slate-700 transition"
              title="Alternar entre perro y gato"
            >
              {petType === 'dog' ? '🐶 Perro' : '🐱 Gato'}
            </button>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Radio Geovalla:</span>
              <span className="font-semibold text-slate-200">{safeZoneRadius} m</span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={safeZoneRadius}
              onChange={(e) => setSafeZoneRadius(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          <button
            onClick={handleSetSafeCenter}
            className="w-full text-[11px] py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 font-medium transition"
          >
            🎯 Fijar posición actual como centro de zona segura
          </button>
        </div>

        {/* Acciones Rápidas */}
        <div className="mt-auto space-y-2 pt-2">
          <button
            onClick={handleCenter}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition"
          >
            <Crosshair className="w-4 h-4" />
            Centrar Mapa en {petName}
          </button>

          <button
            onClick={handleDownloadStandalone}
            className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Descargar index.html (Archivo Único)
          </button>
        </div>

      </div>

      {/* CONTENEDOR DEL MAPA LEAFLET */}
      <div className="flex-1 h-full relative">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Badge flotante de estado sobre el mapa */}
        <div className="absolute top-4 right-4 z-[400] bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 shadow-xl flex items-center gap-2 text-xs">
          <span className="text-slate-400">Modo:</span>
          {isLiveMode ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Servidor Render Real
            </span>
          ) : (
            <span className="text-violet-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-400"></span>
              Simulación Activa
            </span>
          )}
        </div>

        {/* Leyenda flotante en esquina inferior derecha */}
        <div className="absolute bottom-5 right-4 z-[400] bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 shadow-xl text-[11px] text-slate-300 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500 border border-white"></span>
            <span>Ubicación de {petName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-indigo-400 border-dashed border-indigo-300"></span>
            <span>Ruta recorrida</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border border-emerald-400 bg-emerald-500/20"></span>
            <span>Zona Segura ({safeZoneRadius}m)</span>
          </div>
        </div>

      </div>

    </div>
  );
};
