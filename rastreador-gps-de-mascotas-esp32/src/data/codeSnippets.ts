export const ESP32_ORIGINAL_CODE = `#include <WiFi.h>
#include <TinyGPSPlus.h>

// DATOS DEL WIFI DE TU CELULAR
const char* ssid = "NOMBRE_DEL_WIFI";
const char* password = "CONTRASEÑA";

// Dirección de tu servidor en Render
const char* servidor = "rastreador-gps-v4ww.onrender.com";

TinyGPSPlus gps;

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, 18, 5);  // GPS en D18 y D5

  // Conectar al WiFi
  Serial.println("Conectando al WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi conectado!");
}

void loop() {
  // Leer el GPS
  while (Serial2.available() > 0) {
    gps.encode(Serial2.read());
  }

  // Si hay posición válida, la enviamos al servidor
  if (gps.location.isValid()) {
    enviarPosicion(gps.location.lat(), gps.location.lng());
    Serial.print("Enviando: ");
    Serial.print(gps.location.lat(), 6);
    Serial.print(", ");
    Serial.println(gps.location.lng(), 6);
    delay(5000);  // Envía cada 5 segundos
  } else {
    Serial.println("Buscando senal de satelite...");
    delay(1000);
  }
}

void enviarPosicion(float lat, float lng) {
  WiFiClient client;
  if (client.connect(servidor, 80)) {
    // Preparamos los datos en formato JSON
    String datos = "{\\"lat\\":" + String(lat, 6) + ",\\"lng\\":" + String(lng, 6) + "}";

    // Enviamos la petición POST
    client.println("POST /ubicacion HTTP/1.1");
    client.println("Host: " + String(servidor));
    client.println("Content-Type: application/json");
    client.println("Content-Length: " + String(datos.length()));
    client.println();
    client.print(datos);
    client.stop();
    Serial.println("Posicion enviada!");
  } else {
    Serial.println("Error conectando al servidor");
  }
}`;

export const ESP32_FIXED_CODE = `/*
  ==============================================================
   PROYECTO: Rastreador GPS de Mascotas para Colegio (Paraguay)
   AUTORA: Dai
   PLACA: ESP32 DevKit V1 (ESP32-WROOM-32)
   GPS: u-blox NEO-6M (GY-GPS6MV2)
   CABLEADO REAL SOLDADO:
     - TX GPS (Cable Marrón) -> Pin D18 del ESP32 (RX2)
     - RX GPS (Cable Negro)  -> Pin D5 del ESP32  (TX2)
     - VCC GPS (Cable Blanco)-> Pin VIN (5V) del ESP32
     - GND GPS (Cable Rojo)  -> Pin GND del ESP32
  ==============================================================
   CORRECCIÓN CLAVE:
   Render requiere HTTPS (puerto 443 con SSL). El código anterior
   usaba puerto 80 (HTTP sin encriptar), por lo que Render
   respondía 301 Redirect y descartaba las coordenadas.
   Ahora usamos HTTPClient + WiFiClientSecure con setInsecure().
  ==============================================================
*/

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <TinyGPSPlus.h>

// 1. DATOS DEL PUNTO DE ACCESO (HOTSPOT) DE TU CELULAR
const char* ssid = "NOMBRE_DE_TU_HOTSPOT";
const char* password = "TU_CONTRASEÑA_WIFI";

// 2. URL COMPLETA DEL SERVIDOR EN RENDER (CON HTTPS)
const char* servidorURL = "https://rastreador-gps-v4ww.onrender.com/ubicacion";

TinyGPSPlus gps;
unsigned long ultimoEnvio = 0;
const unsigned long intervaloEnvio = 5000; // Envía cada 5 segundos

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n==========================================");
  Serial.println("  INICIANDO RASTREADOR GPS DE MASCOTAS    ");
  Serial.println("==========================================");

  // Inicializar Serial2 para el GPS NEO-6M
  // RX del ESP32 = Pin 18 (cable marrón del TX GPS)
  // TX del ESP32 = Pin 5  (cable negro del RX GPS)
  Serial2.begin(9600, SERIAL_8N1, 18, 5);
  Serial.println("[GPS] Puerto Serial2 iniciado en pines RX=18, TX=5 a 9600 baudios.");

  // Conectar al WiFi del teléfono
  conectarWiFi();
}

void loop() {
  // Asegurarnos de que el WiFi siga conectado
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WIFI] Se perdió la señal. Reconectando...");
    conectarWiFi();
  }

  // Leer continuamente los paquetes NMEA del GPS
  while (Serial2.available() > 0) {
    gps.encode(Serial2.read());
  }

  // Comprobar si ya pasó el tiempo de envío (cada 5 segundos)
  if (millis() - ultimoEnvio >= intervaloEnvio) {
    ultimoEnvio = millis();

    // Verificar si el GPS tiene señal de satélites fijada
    if (gps.location.isValid()) {
      float latitud = gps.location.lat();
      float longitud = gps.location.lng();
      int satelites = gps.satellites.isValid() ? gps.satellites.value() : 0;
      float velocidad = gps.speed.isValid() ? gps.speed.kmph() : 0.0;

      Serial.println("\n------------------------------------");
      Serial.print("📍 [GPS FIX] Satélites: ");
      Serial.println(satelites);
      Serial.print("📍 Latitud: ");
      Serial.println(latitud, 6);
      Serial.print("📍 Longitud: ");
      Serial.println(longitud, 6);
      Serial.print("📍 Velocidad: ");
      Serial.print(velocidad);
      Serial.println(" km/h");

      // Enviar por HTTPS a Render
      enviarPosicionHTTPS(latitud, longitud, satelites, velocidad);
    } else {
      Serial.print("[GPS] Buscando satélites en el cielo... (Sats visibles: ");
      Serial.print(gps.satellites.value());
      Serial.println("). Recuerda estar al aire libre o cerca de una ventana.");
    }
  }
}

// Función para conectar y reconectar al WiFi
void conectarWiFi() {
  Serial.print("[WIFI] Conectando a red: ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  int intentos = 0;
  while (WiFi.status() != WL_CONNECTED && intentos < 30) {
    delay(500);
    Serial.print(".");
    intentos++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WIFI] ¡Conectado con éxito!");
    Serial.print("[WIFI] IP asignada: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n[WIFI] No se pudo conectar. Verifica que el Hotspot esté encendido.");
  }
}

// Función CORREGIDA que envía usando HTTPS (puerto 443) y verifica respuesta HTTP
void enviarPosicionHTTPS(float lat, float lng, int sats, float vel) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[HTTPS] No hay conexión WiFi para enviar.");
    return;
  }

  // Usamos cliente seguro para HTTPS
  WiFiClientSecure client;
  // Permitir conexión SSL sin validar certificado raíz (ideal para Render sin cargar certificados PEM gigantes)
  client.setInsecure();
  client.setTimeout(10000); // 10 segundos de espera por si Render está despertando

  HTTPClient https;

  Serial.println("[HTTPS] Conectando a Render en puerto 443 (HTTPS)...");

  if (https.begin(client, servidorURL)) {
    https.addHeader("Content-Type", "application/json");

    // Construir el JSON
    String jsonPayload = "{\\"lat\\":" + String(lat, 6) + 
                         ",\\"lng\\":" + String(lng, 6) + 
                         ",\\"sat\\":" + String(sats) + 
                         ",\\"speed\\":" + String(vel, 1) + "}";

    Serial.print("[HTTPS] Enviando datos: ");
    Serial.println(jsonPayload);

    // Enviar POST
    int httpCode = https.POST(jsonPayload);

    // ANALIZAR LA RESPUESTA REAL DEL SERVIDOR
    if (httpCode > 0) {
      Serial.print("[HTTPS] Código de respuesta: ");
      Serial.println(httpCode);

      if (httpCode == HTTP_CODE_OK || httpCode == 201) {
        String payload = https.getString();
        Serial.println("✅ [EXITO] Servidor guardó la ubicación:");
        Serial.println(payload);
      } else {
        Serial.print("⚠️ [AVISO] El servidor respondió con código: ");
        Serial.println(httpCode);
        String respuesta = https.getString();
        Serial.println(respuesta);
      }
    } else {
      Serial.print("❌ [ERROR] Falló la petición HTTPS. Motivo: ");
      Serial.println(https.errorToString(httpCode).c_str());
      Serial.println("-> Nota: Si Render estaba 'dormido', puede haber tardado más de 10s en despertar. Reintentará en 5s.");
    }

    https.end();
  } else {
    Serial.println("❌ [ERROR] No se pudo inicializar la conexión HTTPS.");
  }
}`;

export const SERVER_FIXED_CODE = `// ==============================================================
//   SERVIDOR NODE.JS / EXPRESS PARA RASTREADOR GPS (Render)
//   Archivo: server.js
// ==============================================================
//   MEJORAS AÑADIDAS:
//   1. Soporte completo de CORS para que cualquier web o GitHub Pages
//      pueda leer las coordenadas sin bloqueo del navegador.
//   2. Historial de las últimas 50 ubicaciones registradas.
//   3. Ruta /ping para mantener despierto el servidor en Render.
//   4. Logs enriquecidos con fecha y hora de Paraguay (UTC-4).
// ==============================================================

const express = require('express');
const cors = require('cors');

const app = express();

// Permitir peticiones desde cualquier origen (Evita errores de CORS en el frontend)
app.use(cors());

// Parsear cuerpos JSON y urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Variables en memoria para almacenar la telemetría
let ultimaPosicion = null;
const historial = []; // Guarda hasta 50 puntos para dibujar la ruta recorrida

// 1. RUTA PARA RECIBIR COORDENADAS DESDE EL ESP32 (POST)
app.post('/ubicacion', (req, res) => {
  const ahora = new Date();
  console.log(\`[\${ahora.toISOString()}] 📥 Petición POST recibida:\`, req.body);

  // Aceptar lat/lng o latitude/longitude
  const lat = req.body.lat !== undefined ? req.body.lat : req.body.latitude;
  const lng = req.body.lng !== undefined ? req.body.lng : req.body.longitude;
  const sat = req.body.sat || req.body.satellites || 0;
  const speed = req.body.speed || 0;

  if (lat !== undefined && lng !== undefined && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
    ultimaPosicion = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      sat: parseInt(sat) || 0,
      speed: parseFloat(speed) || 0,
      hora: ahora.toISOString()
    };

    // Agregar al historial de recorrido (máximo 50 puntos)
    historial.push({ ...ultimaPosicion });
    if (historial.length > 50) {
      historial.shift();
    }

    console.log('✅ Ubicación actualizada con éxito:', ultimaPosicion);
    return res.status(200).json({ ok: true, mensaje: 'Ubicacion guardada', datos: ultimaPosicion });
  } else {
    console.warn('⚠️ Error: Faltan datos de latitud o longitud válidos');
    return res.status(400).json({ ok: false, error: 'Coordenadas lat/lng requeridas y deben ser numericas' });
  }
});

// 2. RUTA PARA QUE LA PÁGINA WEB CONSULTE LA ÚLTIMA POSICIÓN (GET)
app.get('/datos', (req, res) => {
  if (ultimaPosicion) {
    res.json(ultimaPosicion);
  } else {
    // Si aún no se ha enviado nada desde que encendió el servidor
    res.json({
      lat: null,
      lng: null,
      sat: null,
      speed: null,
      hora: null,
      estado: 'Esperando primera transmision del ESP32'
    });
  }
});

// 3. RUTA PARA CONSULTAR EL HISTORIAL COMPLETO DE LA RUTA (GET)
app.get('/historial', (req, res) => {
  res.json({
    total: historial.length,
    puntos: historial
  });
});

// 4. RUTA DE SALUD / PING PARA MANTENERLO DESPIERTO
app.get('/ping', (req, res) => {
  res.json({ ok: true, uptime: process.uptime(), mensaje: 'Servidor despierto y listo' });
});

// Ruta raíz de bienvenida
app.get('/', (req, res) => {
  res.send('🛰️ Servidor del Rastreador GPS de Mascotas activo. Rutas disponibles: /datos, /historial, /ping');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`🚀 Servidor iniciado en el puerto \${PORT}\`);
});
`;

export const PACKAGE_JSON_SERVER = `{
  "name": "rastreador-gps-servidor",
  "version": "1.0.0",
  "description": "Backend para recibir GPS de ESP32 y servir a mapa web",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.21.2"
  }
}`;

export const HARDWARE_PINS = [
  { pinGPS: 'TX', color: 'Marrón', pinESP32: 'D18 (RX2)', funcion: 'Transmisión de datos NMEA del GPS al ESP32 (Hardware Serial2)' },
  { pinGPS: 'RX', color: 'Negro', pinESP32: 'D5 (TX2)', funcion: 'Recepción de comandos de configuración (no indispensable, pero conectado)' },
  { pinGPS: 'VCC', color: 'Blanco', pinESP32: 'VIN (5V)', funcion: 'Alimentación eléctrica del módulo GPS NEO-6M (requiere 3.3V a 5V)' },
  { pinGPS: 'GND', color: 'Rojo', pinESP32: 'GND', funcion: 'Tierra común de referencia eléctrica' },
];
