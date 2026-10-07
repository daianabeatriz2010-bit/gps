import React, { useState } from 'react';
import { 
  GraduationCap, 
  Mic, 
  HelpCircle, 
  Layers, 
  Award, 
  Copy, 
  Check, 
  BookOpen, 
  CheckCircle2, 
  Volume2 
} from 'lucide-react';

export const SchoolPresentation: React.FC = () => {
  const [copiedSpeech, setCopiedSpeech] = useState(false);
  const [activeTab, setActiveTab] = useState<'speech' | 'qa' | 'slides'>('speech');

  const speechText = `Buenos días profesores, miembros del jurado y compañeros. Mi nombre es Dai y hoy les presento nuestro proyecto de robótica y tecnología: el "Rastreador GPS para Mascotas con ESP32 e Internet de las Cosas".

¿CUÁL ES EL PROBLEMA?
En Paraguay y en el mundo, miles de perros y gatos se pierden cada año. Una plaquita común con un número de teléfono solo sirve si alguien encuentra al animal y decide llamar. Nuestro objetivo fue crear un dispositivo inteligente, autónomo y accesible que permita saber la ubicación exacta de nuestra mascota en tiempo real desde cualquier teléfono o computadora.

¿CÓMO ESTÁ CONSTRUIDO EL DISPOSITIVO?
El corazón del proyecto es un microcontrolador ESP32 DevKit V1 de doble núcleo con conectividad WiFi integrada, conectado a un módulo GPS u-blox NEO-6M con antena cerámica.
El GPS recibe las señales de radio emitidas por los satélites que orbitan la Tierra. Con la información de al menos 4 satélites, el módulo calcula la latitud y la longitud mediante triangulación matemática.

¿CÓMO VIAJA LA INFORMACIÓN?
La cadena de transmisión funciona en 4 pasos:
1. El GPS envía los datos al ESP32 a través de su puerto serial de hardware (Serial2 en los pines 18 y 5).
2. La librería TinyGPSPlus decodifica las coordenadas satelitales en tiempo real.
3. El ESP32 se conecta al WiFi de mi celular y envía un paquete de datos seguro por HTTPS con formato JSON a un servidor en la nube alojado en Render.
4. Desarrollamos una aplicación web interactiva con la librería Leaflet y mapas de OpenStreetMap que consulta al servidor cada 3 segundos y mueve un marcador con el recorrido de la mascota, alertando además si sale de su zona segura.

DESAFÍOS TÉCNICOS QUE SUPERAMOS:
Durante el desarrollo enfrentamos y resolvimos desafíos reales de ingeniería:
- En primer lugar, la comunicación segura HTTPS: descubrimos que la nube moderna exige certificados SSL en el puerto 443, por lo que implementamos clientes seguros en el microcontrolador.
- En segundo lugar, la recepción de satélites: comprendimos cómo las paredes de concreto atenúan las microondas satelitales, necesitando cielo abierto para lograr la primera sincronización.

CONCLUSIÓN:
Este proyecto demuestra cómo la robótica y el Internet de las Cosas pueden resolver problemas de la vida cotidiana en nuestra comunidad. En una próxima etapa, planeamos incorporar un módulo de red celular GSM y una batería de litio para que funcione en cualquier lugar del país sin depender de un router WiFi.

Muchas gracias por su atención, quedo a disposición de sus preguntas.`;

  const handleCopySpeech = () => {
    navigator.clipboard.writeText(speechText);
    setCopiedSpeech(true);
    setTimeout(() => setCopiedSpeech(false), 2000);
  };

  const juryQuestions = [
    {
      q: '¿Por qué usaron los pines D18 y D5 con Serial2 y no el puerto Serial normal?',
      a: 'Porque el puerto Serial0 (pines 1 y 3) está conectado al chip USB del ESP32 que usamos para programarlo desde la computadora y ver el Monitor Serial. El ESP32 tiene tres puertos serie físicos por hardware independientes, y usar Serial2 en los pines 18 y 5 nos permite leer el GPS a 9600 baudios sin interferir con la depuración en pantalla a 115200 baudios.',
      tag: 'Hardware'
    },
    {
      q: '¿Por qué adentro del aula o bajo techo no marcaba coordenadas al principio?',
      a: 'Porque los satélites GPS orbitan a más de 20.000 kilómetros de altura y transmiten ondas de radio de muy baja potencia (alrededor de 1.5 GHz). El concreto, las losas y las chapas de zinc bloquean o reflejan estas ondas. Por eso el módulo NEO-6M necesita estar cerca de una ventana o al aire libre hasta que su LED rojo parpadee, indicando que fijó señal con al menos 4 satélites.',
      tag: 'Física y GPS'
    },
    {
      q: '¿Qué diferencia hay entre usar el puerto 80 y el puerto 443 en la comunicación con Render?',
      a: 'El puerto 80 es para HTTP plano, que no tiene encriptación. Los servidores modernos en la nube como Render exigen HTTPS cifrado con TLS/SSL en el puerto 443 para proteger los datos. Si intentamos conectar por el puerto 80, Render devuelve una redirección 301. En el microcontrolador tuvimos que usar WiFiClientSecure para comunicarnos de forma cifrada.',
      tag: 'Redes y Nube'
    },
    {
      q: '¿Qué es una sentencia NMEA y qué hace la librería TinyGPSPlus?',
      a: 'El chip NEO-6M escupe texto continuo en un formato estándar de navegación llamado NMEA (como las líneas $GPRMC o $GPGGA) con caracteres raros, checksums y hora UTC. La librería TinyGPSPlus procesa ese flujo de caracteres y extrae fácilmente los números limpios de latitud, longitud, velocidad y cantidad de satélites para que podamos usarlos en el programa.',
      tag: 'Software'
    },
    {
      q: '¿Qué pasa si el perro se aleja y se desconecta del WiFi de tu celular?',
      a: 'En esta primera versión, el prototipo requiere conexión a un punto de acceso WiFi (como el hotspot del celular del dueño cuando pasea con la mascota). Para la versión comercial final, la mejora consiste en reemplazar el WiFi por un módulo SIM800L con chip telefónico (Tigo/Personal/Claro) que use datos móviles 4G/GPRS en cualquier rincón del país.',
      tag: 'Innovación Futura'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Encabezado */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-3">
          <GraduationCap className="w-3.5 h-3.5" />
          Material para Feria de Ciencias y Robótica
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          Exposición Escolar: Guión Oral y Preguntas del Jurado
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-2xl">
          Diseñado para que hables con total seguridad y demuestres que entendés tanto el hardware electrónico como la programación y la nube.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('speech')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'speech'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Mic className="w-4 h-4" />
          Guión de Exposición (3-4 minutos)
        </button>

        <button
          onClick={() => setActiveTab('qa')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'qa'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          Preguntas Típicas del Jurado (¡Respuestas 10/10!)
        </button>

        <button
          onClick={() => setActiveTab('slides')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'slides'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          Estructura para Lámina o Cartulina
        </button>
      </div>

      {/* TAB 1: GUIÓN ORAL */}
      {activeTab === 'speech' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-violet-300 font-semibold text-sm">
                <Volume2 className="w-4 h-4 text-violet-400" />
                Guión para leer o practicar frente al espejo
              </div>
              <button
                onClick={handleCopySpeech}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition border border-slate-700"
              >
                {copiedSpeech ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSpeech ? '¡Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>

            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 space-y-4 leading-relaxed font-sans">
              <p className="bg-violet-950/40 border-l-4 border-violet-500 p-3 rounded-r-lg italic text-slate-200">
                "Buenos días profesores, miembros del jurado y compañeros. Mi nombre es Dai y hoy les presento nuestro proyecto de robótica y tecnología: el <strong>Rastreador GPS para Mascotas con ESP32 e Internet de las Cosas</strong>."
              </p>

              <div>
                <h4 className="font-bold text-slate-100 text-sm mb-1 uppercase tracking-wider text-indigo-300">
                  1. El Problema que Resolvemos
                </h4>
                <p>
                  En Paraguay y en el mundo, miles de perros y gatos se pierden cada año. Una plaquita común con un número de teléfono solo sirve si alguien encuentra al animal y decide llamar. Nuestro objetivo fue crear un dispositivo inteligente, autónomo y accesible que permita saber la ubicación exacta de nuestra mascota en tiempo real desde cualquier teléfono o computadora.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-100 text-sm mb-1 uppercase tracking-wider text-indigo-300">
                  2. Componentes y Hardware
                </h4>
                <p>
                  El cerebro del sistema es un microcontrolador <strong>ESP32 DevKit V1</strong> de doble núcleo con conectividad WiFi integrada, conectado a un módulo GPS <strong>u-blox NEO-6M</strong> con antena cerámica de alta sensibilidad. El módulo recibe las microondas emitidas por los satélites GPS en órbita a más de 20.000 kilómetros y, triangulando la distancia con al menos 4 satélites, calcula la latitud y la longitud exacta.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-100 text-sm mb-1 uppercase tracking-wider text-indigo-300">
                  3. La Cadena de Comunicación (IoT)
                </h4>
                <p>
                  La información viaja en cuatro pasos: primero, el GPS envía los datos crudos NMEA por el puerto serie por hardware <strong>Serial2 (pines 18 y 5)</strong>. Segundo, la librería TinyGPSPlus decodifica las coordenadas. Tercero, el microcontrolador se conecta al punto de acceso WiFi de mi celular y envía una petición segura por <strong>HTTPS con formato JSON</strong> a nuestro servidor alojado en la nube en Render. Por último, una aplicación web desarrollada con Leaflet y mapas de OpenStreetMap lee los datos cada 3 segundos y dibuja el recorrido de la mascota con alertas de perímetro.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-100 text-sm mb-1 uppercase tracking-wider text-indigo-300">
                  4. Desafíos que Superamos
                </h4>
                <p>
                  Tuvimos que resolver desafíos reales de ingeniería: descubrimos que la nube moderna exige conexiones cifradas con certificados SSL en el puerto 443 en lugar de conexiones HTTP simples, y comprendimos por qué las paredes de concreto bloquean las señales satelitales, requiriendo cielo abierto para la fijación de posición.
                </p>
              </div>

              <p className="bg-emerald-950/40 border-l-4 border-emerald-500 p-3 rounded-r-lg font-medium text-slate-200">
                "Este proyecto demuestra cómo la robótica y el Internet de las Cosas pueden aplicarse para cuidar a nuestras mascotas en nuestra comunidad. Muchas gracias y quedo a disposición de sus preguntas."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PREGUNTAS DEL JURADO */}
      {activeTab === 'qa' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200">
            ⭐ <strong>Consejo para Dai:</strong> Si un profesor te hace una de estas preguntas y contestas con estos términos técnicos (NMEA, baudios, UART Serial2, puerto 443 SSL), ¡te aseguras la nota máxima porque demuestra que tú misma hiciste y entendiste el proyecto!
          </div>

          <div className="grid grid-cols-1 gap-4">
            {juryQuestions.map((item, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-400 border border-slate-700 uppercase tracking-wider">
                    {item.tag}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Pregunta #{idx + 1}</span>
                </div>
                <h4 className="font-bold text-slate-100 text-sm sm:text-base">
                  ❓ "{item.q}"
                </h4>
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  <span className="text-emerald-400 font-bold block mb-1">🗣️ Tu respuesta:</span>
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DIAPOSITIVAS O CARTULINA */}
      {activeTab === 'slides' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <span className="text-indigo-400 font-bold block text-sm">Cartel 1: Introducción</span>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                <li>Título: Rastreador GPS Inteligente</li>
                <li>Problema: Pérdida de mascotas domésticas</li>
                <li>Objetivo: Monitoreo geográfico en tiempo real sin suscripciones costosas</li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <span className="text-indigo-400 font-bold block text-sm">Cartel 2: Arquitectura IoT</span>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                <li>Satélites GPS (constelación de 31 satélites)</li>
                <li>ESP32 (procesador dual core 240MHz + WiFi)</li>
                <li>Servidor Cloud (Node.js + Express en Render)</li>
                <li>Dashboard Web (Leaflet + OpenStreetMap)</li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <span className="text-indigo-400 font-bold block text-sm">Cartel 3: Conclusiones</span>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                <li>Precisión alcanzada: 2.5 metros a cielo abierto</li>
                <li>Frecuencia de actualización: Cada 5 segundos</li>
                <li>Próximos pasos: Módulo celular SIM800L y carcasa impresa en 3D</li>
              </ul>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
