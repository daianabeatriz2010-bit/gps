import React from 'react';
import { Cpu, Zap, Wifi, Compass, AlertCircle, CheckCircle2 } from 'lucide-react';
import { HARDWARE_PINS } from '../data/codeSnippets';

export const HardwareSchematic: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Encabezado */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
          <Cpu className="w-3.5 h-3.5" />
          Conexiones y Cableado Físico Real
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          Esquema de Pines: ESP32 DevKit V1 + GY-GPS6MV2
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-2xl">
          Este es el mapeo exacto de los cables soldados por tu profesor. Tu código de Arduino debe respetar rigurosamente estos números de pin.
        </p>
      </div>

      {/* TABLA DE CABLES SOLDADOS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Tabla de Correspondencia de Pines y Colores de Cable
          </h3>
          <span className="text-xs text-indigo-400 font-mono">Soldado en Taller</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-3">Pin GPS (NEO-6M)</th>
                <th className="px-6 py-3">Color de Cable</th>
                <th className="px-6 py-3">Pin ESP32</th>
                <th className="px-6 py-3">Función en el Programa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              {HARDWARE_PINS.map((row, idx) => {
                let badgeColor = 'bg-slate-800 text-slate-200 border-slate-700';
                if (row.color === 'Marrón') badgeColor = 'bg-amber-950 text-amber-300 border-amber-800';
                if (row.color === 'Negro') badgeColor = 'bg-slate-950 text-slate-300 border-slate-700';
                if (row.color === 'Blanco') badgeColor = 'bg-slate-100 text-slate-900 border-white';
                if (row.color === 'Rojo') badgeColor = 'bg-rose-950 text-rose-300 border-rose-800';

                return (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-mono font-bold text-indigo-300">
                      {row.pinGPS}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badgeColor}`}>
                        <span className="w-2 h-2 rounded-full" style={{
                          backgroundColor: row.color === 'Marrón' ? '#854d0e' : row.color === 'Negro' ? '#0f172a' : row.color === 'Blanco' ? '#f8fafc' : '#ef4444'
                        }}></span>
                        Cable {row.color}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400">
                      {row.pinESP32}
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {row.funcion}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DIAGRAMA VISUAL DE HARDWARE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tarjeta ESP32 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm">ESP32 DevKit V1 (30 o 36 pines)</h4>
              <p className="text-[11px] text-slate-400">Microcontrolador con antena WiFi y Bluetooth</p>
            </div>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span>Frecuencia CPU:</span>
              <strong className="text-indigo-300 font-mono">240 MHz (Doble Núcleo)</strong>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Baudios Monitor Serial:</span>
              <strong className="text-indigo-300 font-mono">115200 bps</strong>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Baudios GPS Serial2:</span>
              <strong className="text-emerald-400 font-mono">9600 bps</strong>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Línea en código:</span>
              <code className="text-sky-300 font-mono text-[10px]">Serial2.begin(9600, SERIAL_8N1, 18, 5);</code>
            </div>
          </div>
        </div>

        {/* Tarjeta GPS NEO-6M */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm">Módulo u-blox NEO-6M (GY-GPS6MV2)</h4>
              <p className="text-[11px] text-slate-400">Receptor GPS con antena de parche cerámica</p>
            </div>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span>LED Rojo fijo:</span>
              <strong className="text-amber-300 font-sans">Encendido (energizado)</strong>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>LED Rojo parpadeante (1 Hz):</span>
              <strong className="text-emerald-400 font-sans">¡GPS sincronizado con satélites!</strong>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Posición de la antena:</span>
              <strong className="text-slate-200">El cuadrado cerámico mirando al cielo</strong>
            </div>
          </div>
        </div>

      </div>

      {/* 3 CONSEJOS CLAVE DE ELECTRÓNICA PARA DAI */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          3 Secretos para que no falle en las pruebas
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-indigo-300 block">1. Banda WiFi de 2.4 GHz</span>
            <p className="text-slate-400 leading-relaxed">
              En tu celular, al activar la "Zona Wi-Fi portátil / Hotspot", asegúrate de que esté configurado en <strong>Banda de 2.4 GHz</strong> (no 5 GHz), ya que el chip del ESP32 no detecta redes de 5 GHz.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-indigo-300 block">2. Primer encendido ("Cold Start")</span>
            <p className="text-slate-400 leading-relaxed">
              La primera vez que enciendes el GPS en el día, tarda entre <strong>1 y 3 minutos</strong> en descargar el almanaque de efemérides satelitales. Ten paciencia en el patio hasta que el LED empiece a titilar.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-indigo-300 block">3. Alimentación limpia</span>
            <p className="text-slate-400 leading-relaxed">
              El ESP32 consume picos de hasta 500mA al transmitir por WiFi. Utiliza un buen cable micro-USB conectado a un cargador de pared o una power bank que entregue al menos 1A a 5V.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
