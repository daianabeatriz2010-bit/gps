import React, { useState } from 'react';
import { 
  Check, 
  Copy, 
  Download, 
  FileCode, 
  Server, 
  Cpu, 
  Globe, 
  Package, 
  ExternalLink 
} from 'lucide-react';
import { 
  ESP32_FIXED_CODE, 
  ESP32_ORIGINAL_CODE, 
  SERVER_FIXED_CODE, 
  PACKAGE_JSON_SERVER 
} from '../data/codeSnippets';
import { STANDALONE_HTML_CODE } from '../data/sampleLocations';

export const CodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<'esp32' | 'server' | 'html' | 'package'>('esp32');
  const [copied, setCopied] = useState<boolean>(false);

  const getCodeContent = () => {
    switch (selectedFile) {
      case 'esp32':
        return { code: ESP32_FIXED_CODE, filename: 'ESP32_Tracker_Corregido.ino', lang: 'cpp' };
      case 'server':
        return { code: SERVER_FIXED_CODE, filename: 'server.js', lang: 'javascript' };
      case 'html':
        return { code: STANDALONE_HTML_CODE, filename: 'index.html', lang: 'html' };
      case 'package':
        return { code: PACKAGE_JSON_SERVER, filename: 'package.json', lang: 'json' };
    }
  };

  const current = getCodeContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([current.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = current.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Encabezado */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
          <FileCode className="w-3.5 h-3.5" />
          Código Completo Listo para Usar
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          Archivos del Proyecto Corregidos y Probados
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-2xl">
          Copia y pega directamente en tu Arduino IDE y en tu repositorio de Render. Todo el cableado y las librerías coinciden exactamente con lo que soldó tu profesor.
        </p>
      </div>

      {/* Tabs para seleccionar el archivo */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setSelectedFile('esp32')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            selectedFile === 'esp32'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          ESP32: Tracker (Arduino .ino)
          <span className="text-[10px] bg-indigo-900 px-1.5 py-0.5 rounded text-indigo-200 font-bold">Corregido HTTPS</span>
        </button>

        <button
          onClick={() => setSelectedFile('html')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            selectedFile === 'html'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          Web: index.html (Archivo Único)
          <span className="text-[10px] bg-emerald-900 px-1.5 py-0.5 rounded text-emerald-200 font-bold">Leaflet</span>
        </button>

        <button
          onClick={() => setSelectedFile('server')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            selectedFile === 'server'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Server className="w-4 h-4" />
          Servidor: server.js (Node.js)
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-mono">con CORS</span>
        </button>

        <button
          onClick={() => setSelectedFile('package')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            selectedFile === 'package'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          Servidor: package.json
        </button>
      </div>

      {/* Explicación de mejoras según el archivo */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
          💡
        </div>
        <div>
          {selectedFile === 'esp32' && (
            <p>
              <strong>¿Qué cambió en el ESP32?</strong> Se reemplazó <code className="text-amber-300 font-mono">client.connect(servidor, 80)</code> por <code className="text-emerald-300 font-mono">WiFiClientSecure</code> con <code className="text-emerald-300 font-mono">client.setInsecure()</code> en puerto <strong>443 (HTTPS)</strong>. Además, ahora muestra el código de respuesta del servidor (ej. 200 OK) y reconecta automáticamente el WiFi de tu celular si se corta la señal.
            </p>
          )}
          {selectedFile === 'html' && (
            <p>
              <strong>¿Qué tiene este archivo?</strong> Es el archivo <strong>index.html</strong> independiente que pediste. Incluye todo en uno solo (HTML + estilos CSS azul/morado + JavaScript con Leaflet). Solo con abrirlo en tu navegador o subirlo a GitHub Pages ya empieza a consultar tu servidor en Render cada 3 segundos.
            </p>
          )}
          {selectedFile === 'server' && (
            <p>
              <strong>¿Qué cambió en server.js?</strong> Se agregó la librería <code className="text-emerald-300 font-mono">cors</code> (para que el navegador no te bloquee al abrir el mapa web), una ruta <code className="text-sky-300 font-mono">/historial</code> para guardar los últimos 50 puntos y una ruta <code className="text-indigo-300 font-mono">/ping</code> para evitar que Render se duerma.
            </p>
          )}
          {selectedFile === 'package' && (
            <p>
              <strong>Dependencias de Render:</strong> Asegúrate de que tu <code className="font-mono text-indigo-300">package.json</code> en GitHub incluya <code className="font-mono text-emerald-300">"cors": "^2.8.5"</code> además de express.
            </p>
          )}
        </div>
      </div>

      {/* Visor de código */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Barra superior del editor */}
        <div className="bg-slate-900/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
            <span className="ml-2 font-mono text-xs text-slate-300 font-semibold">{current.filename}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '¡Copiado!' : 'Copiar Código'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar</span>
            </button>
          </div>
        </div>

        {/* Bloque de código con scroll */}
        <div className="p-4 overflow-x-auto max-h-[550px] scrollbar-thin">
          <pre className="font-mono text-xs text-slate-300 leading-relaxed">
            <code>{current.code}</code>
          </pre>
        </div>
      </div>

    </div>
  );
};
