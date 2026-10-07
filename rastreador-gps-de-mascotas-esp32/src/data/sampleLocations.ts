export interface GpsLocation {
  lat: number;
  lng: number;
  hora: string;
  satellites?: number;
  speedKmh?: number;
  accuracyM?: number;
  source?: 'real' | 'simulated';
}

// Coordenadas emblemáticas en Paraguay para pruebas
export const DEFAULT_ASUNCION_LOCATIONS: GpsLocation[] = [
  { lat: -25.2822, lng: -57.6351, hora: new Date().toISOString(), satellites: 8, speedKmh: 4.2, accuracyM: 3.5, source: 'simulated' },
  { lat: -25.2826, lng: -57.6358, hora: new Date().toISOString(), satellites: 8, speedKmh: 5.1, accuracyM: 3.2, source: 'simulated' },
  { lat: -25.2831, lng: -57.6366, hora: new Date().toISOString(), satellites: 9, speedKmh: 6.0, accuracyM: 2.8, source: 'simulated' },
  { lat: -25.2838, lng: -57.6375, hora: new Date().toISOString(), satellites: 9, speedKmh: 4.5, accuracyM: 3.0, source: 'simulated' },
  { lat: -25.2845, lng: -57.6382, hora: new Date().toISOString(), satellites: 10, speedKmh: 3.8, accuracyM: 2.5, source: 'simulated' },
  { lat: -25.2852, lng: -57.6373, hora: new Date().toISOString(), satellites: 10, speedKmh: 2.1, accuracyM: 2.2, source: 'simulated' },
  { lat: -25.2847, lng: -57.6361, hora: new Date().toISOString(), satellites: 9, speedKmh: 1.5, accuracyM: 2.5, source: 'simulated' },
  { lat: -25.2839, lng: -57.6353, hora: new Date().toISOString(), satellites: 8, speedKmh: 0.8, accuracyM: 3.1, source: 'simulated' },
];

export const STANDALONE_HTML_CODE = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rastreador GPS de Mascotas | En Vivo</title>
  
  <!-- Leaflet CSS -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    body {
      background-color: #0f172a;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    header {
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
      padding: 16px 24px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      border-bottom: 1px solid #3730a3;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }

    .title-area h1 {
      font-size: 1.4rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .title-area p {
      font-size: 0.85rem;
      color: #c7d2fe;
      margin-top: 2px;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 600;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #ef4444;
      box-shadow: 0 0 10px #ef4444;
      animation: pulse 1.5s infinite;
    }

    .status-dot.online {
      background-color: #10b981;
      box-shadow: 0 0 10px #10b981;
    }

    .status-dot.sleeping {
      background-color: #f59e0b;
      box-shadow: 0 0 10px #f59e0b;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.9); }
    }

    main {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr;
      position: relative;
    }

    @media (min-width: 900px) {
      main {
        grid-template-columns: 340px 1fr;
      }
    }

    #sidebar {
      background: #1e293b;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      border-right: 1px solid #334155;
      z-index: 10;
      overflow-y: auto;
    }

    .card {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 14px;
    }

    .card h3 {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
      margin-bottom: 8px;
    }

    .coords-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .coord-item {
      background: #1e293b;
      padding: 10px;
      border-radius: 8px;
    }

    .coord-item span {
      display: block;
      font-size: 0.75rem;
      color: #64748b;
    }

    .coord-item strong {
      display: block;
      font-size: 1rem;
      color: #38bdf8;
      font-family: monospace;
      margin-top: 2px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      padding: 6px 0;
      border-bottom: 1px solid #1e293b;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-label {
      color: #94a3b8;
    }

    .info-value {
      font-weight: 600;
      color: #f1f5f9;
    }

    #map {
      height: 100%;
      min-height: 450px;
      width: 100%;
      z-index: 1;
    }

    .btn-center {
      background: #4f46e5;
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: background 0.2s;
      width: 100%;
    }

    .btn-center:hover {
      background: #4338ca;
    }

    .pet-marker {
      background: #4f46e5;
      border: 3px solid #ffffff;
      border-radius: 50%;
      color: white;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
  </style>
</head>
<body>

  <header>
    <div class="title-area">
      <h1>🐾 Rastreador GPS de Mascotas</h1>
      <p>ESP32 DevKit V1 + NEO-6M | Proyecto de Robótica (Paraguay)</p>
    </div>

    <div class="status-badge" id="statusBadge">
      <span class="status-dot" id="statusDot"></span>
      <span id="statusText">Conectando al servidor...</span>
    </div>
  </header>

  <main>
    <aside id="sidebar">
      <div class="card">
        <h3>📍 Coordenadas Actuales</h3>
        <div class="coords-grid">
          <div class="coord-item">
            <span>Latitud</span>
            <strong id="valLat">--.------</strong>
          </div>
          <div class="coord-item">
            <span>Longitud</span>
            <strong id="valLng">--.------</strong>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>⏱️ Telemetría y Estado</h3>
        <div class="info-row">
          <span class="info-label">Última actualización:</span>
          <span class="info-value" id="valHora">Esperando datos...</span>
        </div>
        <div class="info-row">
          <span class="info-label">Frecuencia de refresco:</span>
          <span class="info-value">Cada 3 segundos</span>
        </div>
        <div class="info-row">
          <span class="info-label">Puntos registrados:</span>
          <span class="info-value" id="valPuntos">0</span>
        </div>
        <div class="info-row">
          <span class="info-label">Servidor Render:</span>
          <span class="info-value" style="font-size: 0.75rem; color:#818cf8;">onrender.com</span>
        </div>
      </div>

      <button class="btn-center" id="btnCenter">
        🎯 Centrar Mapa en Mascota
      </button>

      <div class="card" style="font-size: 0.78rem; color: #94a3b8; line-height: 1.4;">
        💡 <strong>Nota escolar:</strong> Si el marcador no se mueve al principio, recuerda que el módulo GPS NEO-6M requiere cielo abierto para enganchar satélites (LED rojo debe parpadear en el módulo).
      </div>
    </aside>

    <div id="map"></div>
  </main>

  <!-- Leaflet JS -->
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

  <script>
    // URL del servidor de Dai en Render
    const API_URL = 'https://rastreador-gps-v4ww.onrender.com/datos';

    // Inicializar mapa centrado en Asunción, Paraguay por defecto
    const map = L.map('map').setView([-25.2867, -57.6470], 15);

    // Cargar capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Icono personalizado para la mascota
    const petIcon = L.divIcon({
      className: 'custom-pet-icon',
      html: '<div class="pet-marker" style="width: 36px; height: 36px;">🐶</div>',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    });

    let marker = null;
    let pathCoordinates = [];
    let polyline = L.polyline([], { color: '#6366f1', weight: 4, opacity: 0.8, dashArray: '6, 6' }).addTo(map);
    let firstFix = false;

    const statusBadge = document.getElementById('statusBadge');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const valLat = document.getElementById('valLat');
    const valLng = document.getElementById('valLng');
    const valHora = document.getElementById('valHora');
    const valPuntos = document.getElementById('valPuntos');
    const btnCenter = document.getElementById('btnCenter');

    // Función principal para consultar la posición al servidor
    async function obtenerUbicacion() {
      try {
        const respuesta = await fetch(API_URL);
        
        if (!respuesta.ok) {
          throw new Error('HTTP ' + respuesta.status);
        }

        const data = await respuesta.json();

        // Validar si tenemos coordenadas válidas
        if (data.lat !== null && data.lng !== null && !isNaN(data.lat) && !isNaN(data.lng)) {
          const lat = parseFloat(data.lat);
          const lng = parseFloat(data.lng);

          // Actualizar estado en pantalla
          statusDot.className = 'status-dot online';
          statusText.textContent = 'En vivo (GPS Conectado)';
          valLat.textContent = lat.toFixed(6);
          valLng.textContent = lng.toFixed(6);

          if (data.hora) {
            const fecha = new Date(data.hora);
            valHora.textContent = fecha.toLocaleTimeString('es-PY') + ' (' + fecha.toLocaleDateString('es-PY') + ')';
          } else {
            valHora.textContent = new Date().toLocaleTimeString('es-PY');
          }

          const nuevaPos = [lat, lng];

          // Actualizar o crear marcador en el mapa
          if (!marker) {
            marker = L.marker(nuevaPos, { icon: petIcon }).addTo(map);
            marker.bindPopup('<b>🐾 ¡Aquí está tu mascota!</b><br>Lat: ' + lat.toFixed(6) + '<br>Lng: ' + lng.toFixed(6));
          } else {
            marker.setLatLng(nuevaPos);
          }

          // Agregar al historial de recorrido
          pathCoordinates.push(nuevaPos);
          polyline.setLatLngs(pathCoordinates);
          valPuntos.textContent = pathCoordinates.length;

          // Centrar mapa si es la primera vez que se reciben datos
          if (!firstFix) {
            map.setView(nuevaPos, 16);
            firstFix = true;
          }

        } else {
          // El servidor respondió, pero aún no tiene lat/lng del ESP32
          statusDot.className = 'status-dot sleeping';
          statusText.textContent = 'Esperando señal del ESP32';
          valHora.textContent = 'Servidor activo, sin coordenadas';
        }

      } catch (error) {
        console.warn('Error al consultar GPS:', error);
        statusDot.className = 'status-dot';
        statusText.textContent = 'Servidor Render despertando o desconectado';
      }
    }

    // Botón para centrar
    btnCenter.addEventListener('click', () => {
      if (marker) {
        map.setView(marker.getLatLng(), 17, { animate: true });
        marker.openPopup();
      } else {
        alert('Aún no se ha recibido ninguna coordenada GPS.');
      }
    });

    // Consultar inmediatamente al cargar y luego cada 3 segundos
    obtenerUbicacion();
    setInterval(obtenerUbicacion, 3000);
  </script>
</body>
</html>`;
