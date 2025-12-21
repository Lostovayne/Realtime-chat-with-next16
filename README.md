# 💬 Private Chat - Chat en Tiempo Real con Auto-Destrucción

Una aplicación moderna de chat privado construida con Next.js que permite crear salas de chat temporales con auto-destrucción. Diseñada para conversaciones seguras y efímeras entre dos usuarios.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)
![Elysia](https://img.shields.io/badge/Elysia-1.4-purple?style=flat-square)
![Upstash](https://img.shields.io/badge/Upstash-Redis-orange?style=flat-square)

## ✨ Características

- 🔒 **Chat Privado**: Salas de chat seguras con autenticación basada en tokens
- ⏱️ **Auto-Destrucción**: Las salas se eliminan automáticamente después de 10 minutos
- 👥 **Límite de Usuarios**: Máximo 2 usuarios por sala para conversaciones íntimas
- 🎭 **Anonimato**: Usernames generados automáticamente con nombres de animales
- ⚡ **Tiempo Real**: Mensajería instantánea usando Upstash Realtime
- 🎨 **UI Moderna**: Interfaz oscura y minimalista con Tailwind CSS
- 🚀 **Rendimiento**: Construido con Next.js 16 y React 19 para máxima velocidad
- 📱 **Responsive**: Diseño adaptable a diferentes tamaños de pantalla

## 🏗️ Arquitectura

### Stack Tecnológico

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Backend**: Elysia (framework web rápido y type-safe)
- **Base de Datos**: Upstash Redis (almacenamiento en memoria)
- **Tiempo Real**: Upstash Realtime (WebSockets)
- **Estado**: TanStack Query (React Query)
- **Estilos**: Tailwind CSS 4
- **Linting/Formatting**: Biome
- **ID Generation**: Nanoid

### Estructura del Proyecto

```
realtime_chat/
├── src/
│   ├── app/
│   │   ├── api/[[...slugs]]/    # API Routes (Elysia)
│   │   ├── room/[roomId]/       # Página de sala de chat
│   │   ├── layout.tsx           # Layout principal
│   │   └── page.tsx             # Página de inicio
│   ├── components/
│   │   └── providers.tsx        # Providers de React Query
│   ├── lib/
│   │   ├── client.ts            # Cliente API (Eden Treaty)
│   │   ├── realtime.ts          # Configuración de Realtime
│   │   └── redis.ts             # Cliente Redis
│   └── proxy.ts                 # Middleware de autenticación
├── public/                       # Archivos estáticos
└── package.json
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ o Bun
- Cuenta de Upstash (para Redis y Realtime)
- npm, yarn, pnpm o bun

### Instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd realtime_chat
```

2. **Instalar dependencias**

```bash
npm install
# o
yarn install
# o
pnpm install
# o
bun install
```

3. **Configurar variables de entorno**

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Upstash Redis
UPSTASH_REDIS_REST_URL=tu_url_redis
UPSTASH_REDIS_REST_TOKEN=tu_token_redis

# Upstash Realtime
UPSTASH_REALTIME_URL=tu_url_realtime
UPSTASH_REALTIME_TOKEN=tu_token_realtime

# API URL (opcional, por defecto usa localhost:3000)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. **Ejecutar en desarrollo**

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

5. **Abrir en el navegador**

Navega a [http://localhost:3000](http://localhost:3000)

## 📖 Uso

### Crear una Sala

1. Visita la página principal
2. Tu identidad será generada automáticamente (ej: `anonymous-wolf-abc123`)
3. Haz clic en **"CREATE SECURE ROOM"**
4. Serás redirigido a tu sala privada

### Compartir la Sala

1. En la sala, copia el enlace usando el botón **"COPY"**
2. Comparte el enlace con otra persona
3. La segunda persona puede unirse haciendo clic en el enlace

### Características de la Sala

- **Room ID**: Identificador único de la sala (visible en el header)
- **Self-Destruct Timer**: Contador regresivo que muestra el tiempo restante antes de que la sala se destruya
- **Destroy Now**: Botón para destruir la sala manualmente
- **Chat Input**: Campo de texto para enviar mensajes (presiona Enter para enviar)

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Producción
npm run build        # Construye la aplicación para producción
npm run start        # Inicia el servidor de producción

# Calidad de Código
npm run lint         # Ejecuta Biome para verificar el código
npm run format       # Formatea el código con Biome
```

## 🔐 Seguridad

- **Autenticación por Token**: Cada usuario recibe un token único almacenado en cookies HTTP-only
- **Validación de Sala**: Solo usuarios autenticados pueden acceder a salas específicas
- **Límite de Usuarios**: Máximo 2 usuarios por sala para mantener la privacidad
- **TTL Automático**: Las salas se eliminan automáticamente después de 10 minutos
- **Cookies Seguras**: En producción, las cookies se configuran con `secure` y `sameSite: strict`

## 🎯 API Endpoints

### `POST /api/rooms/create`

Crea una nueva sala de chat.

**Respuesta:**
```json
{
  "roomId": "abc123xyz"
}
```

### `POST /api/messages`

Envía un mensaje a una sala específica.

**Query Parameters:**
- `roomId`: ID de la sala

**Body:**
```json
{
  "sender": "anonymous-wolf-abc123",
  "text": "Hola, ¿cómo estás?"
}
```

**Autenticación:** Requiere cookie `x-auth-token` válida

## 🧩 Componentes Principales

### `Home` (`src/app/page.tsx`)
Página principal donde los usuarios crean nuevas salas. Genera automáticamente un username anónimo y lo almacena en localStorage.

### `Room` (`src/app/room/[roomId]/page.tsx`)
Componente principal de la sala de chat. Muestra:
- Información de la sala (ID, timer de auto-destrucción)
- Área de mensajes
- Input para enviar mensajes

### `authMiddleware` (`src/app/api/[[...slugs]]/auth.ts`)
Middleware de Elysia que valida la autenticación del usuario verificando el token en Redis.

### `proxy` (`src/proxy.ts`)
Middleware de Next.js que:
- Valida la existencia de la sala
- Limita el acceso a 2 usuarios máximo
- Genera y asigna tokens de autenticación

## 🛠️ Desarrollo

### Configuración de Upstash

1. Crea una cuenta en [Upstash](https://upstash.com/)
2. Crea una base de datos Redis
3. Crea un servicio Realtime
4. Copia las credenciales a tu archivo `.env.local`

### Estructura de Datos en Redis

```
meta:{roomId}
  - connected: string[]      # Array de tokens de usuarios conectados
  - createdAt: number        # Timestamp de creación
  - TTL: 600 segundos (10 minutos)
```

### Flujo de Autenticación

1. Usuario accede a `/room/{roomId}`
2. El middleware `proxy` verifica si la sala existe
3. Si no tiene token, se genera uno nuevo con `nanoid()`
4. El token se almacena en Redis y en una cookie HTTP-only
5. Las solicitudes API validan el token usando `authMiddleware`

## 🚢 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. Despliega automáticamente en cada push

### Variables de Entorno Requeridas

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `UPSTASH_REALTIME_URL`
- `UPSTASH_REALTIME_TOKEN`
- `NEXT_PUBLIC_API_URL` (opcional)

## 📝 Licencia

Este proyecto es privado y de código cerrado.

## 🤝 Contribuciones

Las contribuciones no están abiertas actualmente. Este es un proyecto privado.

## 📧 Contacto

Para preguntas o soporte, por favor contacta al mantenedor del proyecto.

---

**Desarrollado con ❤️ usando Next.js, React y Upstash**
