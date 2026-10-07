import React, { useState } from 'react';
import { 
  Rocket, 
  Github, 
  Server, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  Lightbulb, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { STANDALONE_HTML_CODE } from '../data/sampleLocations';

export const DeploymentGuide: React.FC = () => {
  const [platform, setPlatform] = useState<'github' | 'render'>('github');

  const handleDownload = () => {
    const blob = new Blob([STANDALONE_HTML_CODE], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Encabezado */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
          <Rocket className="w-3.5 h-3.5" />
          Guía Paso a Paso para Principiantes
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          Cómo Publicar tu Página Web en Internet Gratis
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-2xl">
          Para que cualquier persona (tus compañeros, el profesor o tus familiares) pueda ver el mapa de tu mascota desde su propio celular entrando a un enlace web.
        </p>
      </div>

      {/* Botón de descarga de index.html */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-700/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Paso Previo: Descargá tu archivo listo
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Solo necesitas este único archivo llamado <code className="text-indigo-300 font-mono">index.html</code> que ya tiene todo el mapa de Leaflet y la conexión a tu servidor.
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition shrink-0"
        >
          <Download className="w-4 h-4" />
          Descargar index.html
        </button>
      </div>

      {/* Selector de Plataforma */}
      <div className="flex gap-3 border-b border-slate-800 pb-4">
        <button
          onClick={() => setPlatform('github')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition ${
            platform === 'github'
              ? 'bg-slate-100 text-slate-900 shadow-lg'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Github className="w-4 h-4" />
          Opción 1: GitHub Pages (¡La más recomendada!)
          <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full">100% Gratis</span>
        </button>

        <button
          onClick={() => setPlatform('render')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition ${
            platform === 'render'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Server className="w-4 h-4" />
          Opción 2: Render Static Site
        </button>
      </div>

      {/* CONTENIDO OPCIÓN 1: GITHUB PAGES */}
      {platform === 'github' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
              <Github className="w-5 h-5 text-indigo-400" />
              Desplegar en GitHub Pages (en 4 minutos sin comandos)
            </h3>

            <div className="space-y-5">
              {/* Paso 1 */}
              <div className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <div className="space-y-1 text-xs text-slate-300">
                  <strong className="text-slate-100 text-sm block">Crear un repositorio nuevo en GitHub</strong>
                  <p>
                    Entra a tu cuenta en <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-indigo-400 underline inline-flex items-center gap-1 font-semibold">github.com/new <ExternalLink className="w-3 h-3" /></a> y ponle de nombre, por ejemplo: <code className="bg-slate-950 px-2 py-0.5 rounded text-indigo-300 font-mono">rastreador-mascota-web</code>.
                  </p>
                  <p className="text-slate-400">
                    Asegúrate de marcarlo como <strong>Public</strong> (Público) y marca la casilla <em>"Add a README file"</em>.
                  </p>
                </div>
              </div>

              {/* Paso 2 */}
              <div className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <div className="space-y-1 text-xs text-slate-300">
                  <strong className="text-slate-100 text-sm block">Subir el archivo index.html</strong>
                  <p>
                    Dentro de tu nuevo repositorio, haz clic en el botón <strong>Add file</strong> → <strong>Upload files</strong>.
                  </p>
                  <p>
                    Arrastra el archivo <code className="bg-slate-950 px-2 py-0.5 rounded text-emerald-400 font-mono">index.html</code> que descargaste arriba y haz clic en el botón verde <strong>Commit changes</strong>.
                  </p>
                </div>
              </div>

              {/* Paso 3 */}
              <div className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </span>
                <div className="space-y-1 text-xs text-slate-300">
                  <strong className="text-slate-100 text-sm block">Activar GitHub Pages</strong>
                  <p>
                    Arriba en las pestañas del repositorio, haz clic en <strong>Settings</strong> (Configuración ⚙️).
                  </p>
                  <p>
                    En el menú lateral izquierdo, busca la opción <strong>Pages</strong>.
                  </p>
                  <p>
                    En la sección <em>Branch</em>, cambia <strong>None</strong> por <strong className="text-indigo-300">main</strong> y haz clic en <strong>Save</strong>.
                  </p>
                </div>
              </div>

              {/* Paso 4 */}
              <div className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  ✓
                </span>
                <div className="space-y-1 text-xs text-slate-300">
                  <strong className="text-emerald-300 text-sm block">¡Listo! Tu web ya está en internet</strong>
                  <p>
                    Espera 1 minuto y recarga la página de Settings. Te aparecerá un cartel verde con tu enlace oficial:
                  </p>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-emerald-400 text-xs mt-2">
                    https://tu-usuario.github.io/rastreador-mascota-web/
                  </div>
                  <p className="text-slate-400 mt-1">
                    ¡Ese enlace lo podés abrir desde cualquier celular en el colegio y ver el mapa en vivo!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO OPCIÓN 2: RENDER STATIC SITE */}
      {platform === 'render' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-400" />
              Desplegar en Render como Static Site
            </h3>

            <div className="space-y-5">
              <div className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <div className="space-y-1 text-xs text-slate-300">
                  <strong className="text-slate-100 text-sm block">Crear nuevo servicio en Render</strong>
                  <p>
                    Entra a tu cuenta en <a href="https://dashboard.render.com" target="_blank" rel="noreferrer" className="text-indigo-400 underline font-semibold">dashboard.render.com</a>.
                  </p>
                  <p>
                    Haz clic en el botón azul <strong>New +</strong> y selecciona <strong>Static Site</strong>.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <div className="space-y-1 text-xs text-slate-300">
                  <strong className="text-slate-100 text-sm block">Conectar tu repositorio de GitHub</strong>
                  <p>
                    Elige el repositorio donde subiste tu <code className="font-mono text-indigo-300">index.html</code>.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </span>
                <div className="space-y-1 text-xs text-slate-300">
                  <strong className="text-slate-100 text-sm block">Configuración de compilación (Build Command)</strong>
                  <p>
                    Como es HTML puro:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 ml-1">
                    <li><strong>Build Command:</strong> Déjalo en blanco o ponle <code className="font-mono text-slate-300">echo "Static"</code>.</li>
                    <li><strong>Publish Directory:</strong> Ponle <code className="font-mono text-indigo-300">.</code> (un punto, que significa la raíz).</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  ✓
                </span>
                <div className="space-y-1 text-xs text-slate-300">
                  <strong className="text-emerald-300 text-sm block">Crear Static Site</strong>
                  <p>
                    Haz clic en <strong>Create Static Site</strong>. En unos 30 segundos Render te dará una URL terminada en <code className="font-mono text-indigo-300">.onrender.com</code>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONSEJO SECRETO: CÓMO EVITAR QUE RENDER SE DUERMA EN LA FERIA */}
      <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-600/40 rounded-2xl p-6 space-y-3 shadow-xl">
        <div className="flex items-center gap-2.5 text-amber-300 font-bold text-sm">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          Truco Pro para la Exposición en el Colegio: Evitar que Render se "duerma"
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Para que cuando el jurado o tu profesor se acerquen al stand de robótica el mapa cargue de inmediato (sin esperar 40 segundos):
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <strong className="text-slate-200 block">Opción A: Abrir el enlace 5 min antes</strong>
            <p className="text-slate-400">
              Antes de que empiece la presentación, abre <code className="text-indigo-300 font-mono">https://rastreador-gps-v4ww.onrender.com/ping</code> en tu celular para que la máquina virtual de Render despierte y quede lista.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <strong className="text-slate-200 block">Opción B: Usar UptimeRobot (Gratis)</strong>
            <p className="text-slate-400">
              Creas una cuenta gratis en <a href="https://uptimerobot.com" target="_blank" rel="noreferrer" className="text-indigo-400 underline font-semibold">uptimerobot.com</a> y agregas un monitor HTTP a tu URL cada 5 minutos. ¡Así nunca se duerme!
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
