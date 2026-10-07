import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Server, 
  ShieldAlert, 
  Terminal, 
  ExternalLink, 
  Play, 
  Zap, 
  Clock, 
  RefreshCw,
  Lock,
  ArrowRight,
  Database
} from 'lucide-react';

interface DiagnosticsProps {
  onSendTestCoord: (lat: number, lng: number) => Promise<boolean>;
  isChecking: boolean;
  onRefresh: () => void;
  serverUrl: string;
}

export const Diagnostics: React.FC<DiagnosticsProps> = ({
  onSendTestCoord,
  isChecking,
  onRefresh,
  serverUrl
}) => {
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [testLog, setTestLog] = useState<string>('');
  const [isSendingTest, setIsSendingTest] = useState(false);

  const handleTestPost = async () => {
    setIsSendingTest(true);
    setTestStatus('Enviando...');
    setTestLog('Iniciando prueba POST a Render...\nDestino: https://rastreador-gps-v4ww.onrender.com/ubicacion\n');

    try {
      const payload = {
        lat: -25.283045,
        lng: -57.631999,
        sat: 8,
        speed: 3.2
      };

      setTestLog(prev => prev + `Cuerpo JSON: ${JSON.stringify(payload, null, 2)}\n`);

      const resp = await fetch('https://rastreador-gps-v4ww.onrender.com/ubicacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await resp.json().catch(() => ({}));

      if (resp.ok) {
        setTestStatus('¡Éxito 200 OK!');
        setTestLog(prev => prev + `\n✅ RESPUESTA DEL SERVIDOR (${resp.status} OK):\n${JSON.stringify(data, null, 2)}\n\n¡El servidor en Render está despierto y aceptó las coordenadas! Ahora /datos mostrará esta posición.`);
        onRefresh();
      } else {
        setTestStatus(`Error HTTP ${resp.status}`);
        setTestLog(prev => prev + `\n⚠️ El servidor respondió con error ${resp.status}:\n${JSON.stringify(data, null, 2)}`);
      }
    } catch (err: any) {
      setTestStatus('Error de conexión');
      setTestLog(prev => prev + `\n❌ Falló la petición: ${err.message || 'Posible bloqueo de CORS o servidor dormido.'}\nNota: Si el servidor de Render está dormido, tarda unos 40 segundos en iniciar. Prueba nuevamente en un momento.`);
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Título de la sección */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-3">
          <AlertTriangle className="w-3.5 h-3.5" />
          Investigación Técnica Especial para Dai
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          ¿Por qué el Monitor Serial dice <span className="text-emerald-400">"Posición enviada!"</span> pero <code className="text-amber-400 font-mono text-xl sm:text-2xl">/datos</code> devuelve <code className="text-rose-400 font-mono text-xl sm:text-2xl">null</code>?
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-3xl leading-relaxed">
          Este es el problema más común al conectar microcontroladores como el ESP32 con servidores modernos en la nube. A continuación te explicamos exactamente qué está pasando y cómo lo resolvimos.
        </p>
      </div>

      {/* BANNER DE PRUEBA INTERACTIVA */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              Probador de Diagnóstico en Tiempo Real
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Prueba si tu servidor en Render (<code className="text-indigo-300">rastreador-gps-v4ww.onrender.com</code>) está despierto y acepta datos.
            </p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleTestPost}
              disabled={isSendingTest}
              className="flex-1 sm:flex-initial px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/25"
            >
              {isSendingTest ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Enviar Coordenada de Prueba (POST)
            </button>
            <button
              onClick={onRefresh}
              disabled={isChecking}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 transition"
              title="Consultar /datos ahora"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
        </div>

        {testStatus && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap">
            {testLog}
          </div>
        )}
      </div>

      {/* LOS 4 MOTIVOS PRINCIPALES EXPLICADOS DE FORMA SENCILLA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Motivo 1: El puerto 80 vs 443 (LA CAUSA RAÍZ) */}
        <div className="bg-slate-900 border-2 border-indigo-500/40 rounded-2xl p-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-600 text-[10px] font-bold text-white rounded-bl-xl uppercase tracking-wider">
            Causa #1 (Principal)
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-100 text-base mb-2">
            1. El "Engaño" del Puerto 80 vs 443 (HTTPS)
          </h4>
          <p className="text-slate-300 text-xs leading-relaxed mb-3">
            En tu código actual pusiste:
          </p>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-rose-300 mb-3">
            client.connect(servidor, 80); // ❌ Puerto 80 es HTTP plano
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            <strong>Render obliga a usar HTTPS (puerto 443 con certificado SSL).</strong> Cuando el ESP32 se conecta al puerto 80, Render no guarda nada; en su lugar le responde un código <code className="text-amber-300 font-mono">301 Moved Permanently</code> diciendo "andá a https://". Como tu código no leía la respuesta del servidor, ¡asumió que todo salió bien e imprimió "Posición enviada!".
          </p>
          <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
            <strong>La Solución:</strong> Usar la librería <code className="font-mono text-emerald-200">WiFiClientSecure</code> y <code className="font-mono text-emerald-200">HTTPClient</code> apuntando a <code className="font-mono text-emerald-200">https://</code> (puerto 443).
          </div>
        </div>

        {/* Motivo 2: El ESP32 no verificaba el código HTTP */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
            <Terminal className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-100 text-base mb-2">
            2. El ESP32 imprime "Posición enviada!" a ciegas
          </h4>
          <p className="text-slate-400 text-xs leading-relaxed mb-3">
            Mira las últimas líneas de tu función <code className="text-indigo-300 font-mono">enviarPosicion()</code>:
          </p>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 mb-3">
            client.print(datos);<br/>
            client.stop();<br/>
            Serial.println("Posicion enviada!"); // ⚠️ No espera respuesta
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Tu código cerraba la conexión inmediatamente después de enviar los datos, sin esperar si el servidor respondió <code className="text-emerald-400 font-mono">200 OK</code> o si devolvió un error. Por eso en la pantalla decía que se envió, pero el servidor nunca procesó los datos.
          </p>
        </div>

        {/* Motivo 3: Servidor dormido en Render (Cold Start) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-100 text-base mb-2">
            3. El Servidor Gratuito de Render se "Duerme"
          </h4>
          <p className="text-slate-400 text-xs leading-relaxed mb-3">
            El plan gratuito de Render apaga el servidor si pasan 15 minutos sin visitas. Cuando el ESP32 intenta conectarse por primera vez:
          </p>
          <ul className="list-disc list-inside text-xs text-slate-400 space-y-1.5 mb-3">
            <li>Render tarda entre <strong>30 y 50 segundos</strong> en iniciar la máquina virtual.</li>
            <li>El ESP32 normalmente se da por vencido por timeout tras unos 5 segundos.</li>
          </ul>
          <p className="text-slate-400 text-xs leading-relaxed">
            Para evitar esto, en el código nuevo le pusimos un timeout mayor (<code className="font-mono text-sky-300">client.setTimeout(10000)</code>) y una ruta <code className="font-mono text-sky-300">/ping</code> para mantenerlo despierto.
          </p>
        </div>

        {/* Motivo 4: Memoria RAM volátil */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
            <Database className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-100 text-base mb-2">
            4. Los datos se guardan en RAM (<code className="font-mono text-purple-300">let ultimaPosicion</code>)
          </h4>
          <p className="text-slate-400 text-xs leading-relaxed mb-3">
            En tu archivo <code className="text-slate-200 font-mono">server.js</code> tienes:
          </p>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-purple-300 mb-3">
            let ultimaPosicion = null;
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Esto guarda las coordenadas en la memoria RAM del servidor. Cada vez que Render se duerme o reinicia el servidor, la variable vuelve a ser <code className="text-rose-400 font-mono">null</code>. Por eso, si el ESP32 envió datos hace unas horas pero el servidor se reinició, al abrir <code className="font-mono text-indigo-300">/datos</code> vuelve a mostrar <code className="font-mono text-rose-300">null</code> hasta que el ESP32 vuelva a transmitir.
          </p>
        </div>

      </div>

      {/* GUÍA RÁPIDA: CÓMO VER LOS LOGS EN RENDER */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h4 className="font-bold text-slate-100 text-base flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" />
          Cómo mirar los Logs en Render para ver si el ESP32 está llegando
        </h4>
        <div className="space-y-3 text-xs text-slate-300">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">1</span>
            <div>
              Entra a tu cuenta en <a href="https://dashboard.render.com" target="_blank" rel="noreferrer" className="text-indigo-400 underline font-semibold inline-flex items-center gap-1">dashboard.render.com <ExternalLink className="w-3 h-3" /></a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">2</span>
            <div>
              Haz clic en tu servicio web (se llama algo como <span className="text-indigo-300 font-mono">rastreador-gps-v4ww</span>).
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">3</span>
            <div>
              En el menú de la izquierda, haz clic en <strong>Logs</strong>.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">4</span>
            <div>
              Observa si aparece la línea: <code className="bg-slate-950 px-2 py-0.5 rounded text-emerald-400 font-mono">Recibido body: {"{"}"lat":-25.28...{"}"}</code>. Si no aparece ninguna línea cuando el ESP32 dice "Posición enviada", confirma al 100% que la petición del ESP32 está siendo bloqueada por la falta de HTTPS (puerto 443).
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
