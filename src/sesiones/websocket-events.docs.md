# 📡 Documentación de Eventos WebSocket

## 🔗 Conexión

### Endpoint
```
ws://localhost:3000
```

### Autenticación
Las conexiones WebSocket requieren autenticación JWT. El token debe proporcionarse de una de estas formas:

**1. Objeto auth en el handshake (RECOMENDADO):**
```javascript
const socket = io('ws://localhost:3000', {
  auth: {
    token: 'tu-token-jwt-aqui'
  }
});
```

**2. Header Authorization:**
```javascript
const socket = io('ws://localhost:3000', {
  extraHeaders: {
    Authorization: 'Bearer tu-token-jwt-aqui'
  }
});
```

> ⚠️ **IMPORTANTE:** Sin un token válido, la conexión será rechazada inmediatamente.

---

## 📤 Eventos Enviados por el Cliente

### 1. `join_session` - Unirse a Sesión

| Propiedad | Valor |
|-----------|-------|
| **Dirección** | Cliente → Servidor |
| **Requiere** | Usuario autenticado |
| **Restricciones** | Estudiantes deben estar inscritos en el curso |

**Payload:**
```typescript
{
  sessionId: number  // ID de la sesión a la que unirse
}
```

**Ejemplo de uso:**
```javascript
socket.emit('join_session', { sessionId: 1 });
```

**Validaciones automáticas:**
- ✅ Usuario autenticado con JWT válido
- ✅ Estudiante inscrito en el curso (si rol = estudiante)
- ✅ Sesión existe en la base de datos
- ✅ Se registra hora de conexión para asistencia

**Respuesta del servidor:**
```typescript
// Evento: joined_successfully (solo al cliente)
{
  sessionId: number,
  connectedCount: number
}

// Evento: user.joined_session (a todos en la sala)
{
  userId: number,
  sessionId: number,
  timestamp: Date,
  connectedCount: number
}
```

---

### 2. `send_message` - Enviar Mensaje de Chat

| Propiedad | Valor |
|-----------|-------|
| **Dirección** | Cliente → Servidor → Todos en la sala |
| **Requiere** | Usuario en una sesión |
| **Registro** | Se guarda como participación tipo MENSAJE |

**Payload:**
```typescript
{
  sessionId: number,  // ID de la sesión
  message: string     // Contenido del mensaje
}
```

**Ejemplo de uso:**
```javascript
socket.emit('send_message', {
  sessionId: 1,
  message: '¡Hola a todos!'
});
```

**Acciones automáticas:**
1. Mensaje se guarda en tabla `participaciones` con tipo `MENSAJE`
2. Se emite `chat.message_sent` a todos los usuarios en la sala

---

### 3. `ask_question` - Hacer una Pregunta

| Propiedad | Valor |
|-----------|-------|
| **Dirección** | Cliente → Servidor → Todos en la sala |
| **Requiere** | Usuario en una sesión |
| **Registro** | Se guarda como participación tipo PREGUNTA |

**Payload:**
```typescript
{
  sessionId: number,  // ID de la sesión
  question: string    // Contenido de la pregunta
}
```

**Ejemplo de uso:**
```javascript
socket.emit('ask_question', {
  sessionId: 1,
  question: '¿Pueden explicar el concepto otra vez?'
});
```

**Acciones automáticas:**
1. Pregunta se guarda en tabla `participaciones` con tipo `PREGUNTA`
2. Se emite `question.asked` a todos los usuarios en la sala

> 💡 **Nota:** Las preguntas tienen prioridad visual en el frontend para que el profesor las vea destacadas.

---

## 📥 Eventos Recibidos por el Cliente

### 4. `joined_successfully` - Confirmación de Unión

| Propiedad | Valor |
|-----------|-------|
| **Dirección** | Servidor → Cliente (solo al que se unió) |
| **Cuándo** | Después de unirse exitosamente a una sesión |

**Payload:**
```typescript
{
  sessionId: number,     // ID de la sesión
  connectedCount: number // Total de usuarios conectados
}
```

**Manejo en cliente:**
```javascript
socket.on('joined_successfully', (data) => {
  console.log(`Te uniste a la sesión ${data.sessionId}`);
  console.log(`Usuarios conectados: ${data.connectedCount}`);
  // Habilitar chat, mostrar lista de usuarios, etc.
});
```

---

### 5. `user.joined_session` - Usuario Se Unió

| Propiedad | Valor |
|-----------|-------|
| **Dirección** | Servidor → Todos en la sala |
| **Cuándo** | Cuando cualquier usuario se une a la sesión |

**Payload:**
```typescript
{
  userId: number,        // ID del usuario que se unió
  sessionId: number,     // ID de la sesión
  timestamp: Date,       // Momento de conexión
  connectedCount: number // Total de conectados
}
```

**Manejo en cliente:**
```javascript
socket.on('user.joined_session', (data) => {
  console.log(`Usuario ${data.userId} se unió`);
  console.log(`Total conectados: ${data.connectedCount}`);
  // Actualizar lista de usuarios en UI
});
```

---

### 6. `user.left_session` - Usuario Salió

| Propiedad | Valor |
|-----------|-------|
| **Dirección** | Servidor → Todos en la sala |
| **Cuándo** | Cuando un usuario se desconecta |
| **Automático** | Se calcula duración y asistencia |

**Payload:**
```typescript
{
  userId: number,        // ID del usuario que salió
  sessionId: number,     // ID de la sesión
  timestamp: Date,       // Momento de desconexión
  connectedCount: number // Total de conectados restantes
}
```

**Acciones automáticas al desconectar:**
1. Se registra `desconectadoEn` en asistencias
2. Se calcula duración de conexión en segundos
3. Se evalúa si cumple umbral de asistencia (≥10 minutos)
4. Si cumple, se marca `presente: true`

**Manejo en cliente:**
```javascript
socket.on('user.left_session', (data) => {
  console.log(`Usuario ${data.userId} salió`);
  console.log(`Quedan ${data.connectedCount} conectados`);
  // Actualizar lista de usuarios en UI
});
```

---

### 7. `chat.message_sent` - Mensaje de Chat Recibido

| Propiedad | Valor |
|-----------|-------|
| **Dirección** | Servidor → Todos en la sala |
| **Cuándo** | Cuando alguien envía un mensaje |

**Payload:**
```typescript
{
  userId: number,    // ID del remitente
  sessionId: number, // ID de la sesión
  message: string,   // Contenido del mensaje
  timestamp: Date    // Momento del envío
}
```

**Manejo en cliente:**
```javascript
socket.on('chat.message_sent', (data) => {
  const chatBox = document.getElementById('chat');
  chatBox.innerHTML += `
    <div class="mensaje">
      <strong>Usuario ${data.userId}:</strong> ${data.message}
      <small>${new Date(data.timestamp).toLocaleTimeString()}</small>
    </div>
  `;
});
```

---

### 8. `question.asked` - Pregunta Realizada

| Propiedad | Valor |
|-----------|-------|
| **Dirección** | Servidor → Todos en la sala |
| **Cuándo** | Cuando un estudiante hace una pregunta |
| **Destacado** | Las preguntas deben mostrarse con prioridad |

**Payload:**
```typescript
{
  userId: number,    // ID del estudiante
  sessionId: number, // ID de la sesión
  question: string,  // Contenido de la pregunta
  timestamp: Date    // Momento de la pregunta
}
```

**Manejo en cliente:**
```javascript
socket.on('question.asked', (data) => {
  const preguntasBox = document.getElementById('preguntas');
  preguntasBox.innerHTML += `
    <div class="pregunta destacada">
      <strong>❓ Usuario ${data.userId} pregunta:</strong>
      <p>${data.question}</p>
    </div>
  `;
  // Reproducir sonido de notificación para el profesor
});
```

---

### 9. `session.started` - Sesión Iniciada

| Propiedad | Valor |
|-----------|-------|
| **Dirección** | Servidor → Todos en la sala |
| **Disparado por** | Profesor vía `PATCH /sesiones/:id/iniciar` |
| **Estado** | La sesión pasa de PROGRAMADA a EN_VIVO |

**Payload:**
```typescript
{
  sessionId: number, // ID de la sesión
  timestamp: Date    // Momento de inicio
}
```

**Manejo en cliente:**
```javascript
socket.on('session.started', (data) => {
  console.log(`¡La sesión ${data.sessionId} ha comenzado!`);
  // Habilitar botones de chat y preguntas
  document.getElementById('chatInput').disabled = false;
  // Mostrar notificación
  alert('¡La clase ha comenzado!');
});
```

---

### 10. `session.ended` - Sesión Finalizada

| Propiedad | Valor |
|-----------|-------|
| **Dirección** | Servidor → Todos en la sala |
| **Disparado por** | Profesor vía `PATCH /sesiones/:id/finalizar` |
| **Estado** | La sesión pasa de EN_VIVO a FINALIZADA |

**Payload:**
```typescript
{
  sessionId: number, // ID de la sesión
  timestamp: Date    // Momento de finalización
}
```

**Acciones automáticas:**
1. Todos los usuarios son desconectados de la sala
2. Se calculan todas las asistencias finales
3. Se limpia el mapa de usuarios conectados
4. No se pueden enviar más mensajes

**Manejo en cliente:**
```javascript
socket.on('session.ended', (data) => {
  console.log(`La sesión ${data.sessionId} ha terminado`);
  // Deshabilitar chat
  document.getElementById('chatInput').disabled = true;
  // Mostrar resumen
  mostrarResumenAsistencia();
  // Desconectar
  socket.disconnect();
});
```

---

### 11. `error` - Error

| Propiedad | Valor |
|-----------|-------|
| **Dirección** | Servidor → Cliente (solo al afectado) |
| **Cuándo** | Cuando ocurre un error en operaciones WebSocket |

**Payload:**
```typescript
{
  message: string  // Descripción del error
}
```

**Errores comunes:**
| Mensaje | Causa |
|---------|-------|
| `"Usuario no autenticado"` | Token JWT inválido o expirado |
| `"No estás inscrito en este curso"` | Estudiante no inscrito |
| `"Sesión no encontrada"` | ID de sesión no existe |

**Manejo en cliente:**
```javascript
socket.on('error', (data) => {
  console.error('Error WebSocket:', data.message);
  mostrarAlerta(data.message, 'error');
});
```

---

## 📊 Control de Asistencia Automática

### ¿Cómo Funciona?

```
┌─────────────┐    join_session    ┌─────────────┐
│  Estudiante │ ─────────────────► │   Servidor  │
│  se conecta │                    │ registra    │
└─────────────┘                    │ conectadoEn │
                                   └─────────────┘
       │                                  │
       │ (estudiante participa            │
       │  en la clase)                    │
       │                                  │
       ▼                                  ▼
┌─────────────┐    desconexión     ┌─────────────┐
│  Estudiante │ ─────────────────► │   Servidor  │
│  se va      │                    │ registra    │
└─────────────┘                    │ desconectar │
                                   └─────────────┘
                                          │
                                          ▼
                                   ┌─────────────┐
                                   │  ¿Duración  │
                                   │  ≥ 10 min?  │
                                   └─────────────┘
                                     │       │
                                    Sí      No
                                     │       │
                                     ▼       ▼
                              ┌──────────┐ ┌──────────┐
                              │ presente │ │ presente │
                              │ = true   │ │ = false  │
                              └──────────┘ └──────────┘
```

### Umbral de Asistencia

| Configuración | Valor |
|---------------|-------|
| **Umbral por defecto** | 10 minutos (600 segundos) |
| **Configurable** | Sí, vía endpoint `/asistencias/evaluar` |
| **Mínimo recomendado** | 5 minutos |

### Tabla de Asistencias

```sql
CREATE TABLE asistencias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sesionId INT NOT NULL,
  estudianteId INT NOT NULL,
  conectadoEn DATETIME,      -- Momento de conexión
  desconectadoEn DATETIME,   -- Momento de desconexión
  duracionSeg INT DEFAULT 0, -- Duración en segundos
  presente BOOLEAN DEFAULT FALSE,
  creadoEn DATETIME DEFAULT NOW()
);
```

---

## 🔒 Notas de Seguridad

| # | Medida | Descripción |
|---|--------|-------------|
| 1 | **Autenticación obligatoria** | Todas las conexiones WebSocket requieren JWT válido |
| 2 | **Validación de inscripción** | Estudiantes solo pueden unirse a sesiones de cursos donde están inscritos |
| 3 | **Control por roles** | Solo profesores pueden iniciar/finalizar sesiones |
| 4 | **Estado de sesión** | Solo se puede participar en sesiones EN_VIVO |
| 5 | **Asistencia bloqueada** | No se puede modificar asistencia después de finalizar sesión |
| 6 | **Auditoría** | Se registran intentos de acceso no autorizado |

---

## 🧪 Herramienta de Prueba

El proyecto incluye `websocket-tester.html` para probar WebSocket fácilmente:

1. Abre el archivo en tu navegador
2. Ingresa credenciales y haz login
3. Conecta al WebSocket
4. Únete a una sesión
5. Envía mensajes y preguntas

**Ubicación:** `websocket-tester.html` (raíz del proyecto)

---

## 📝 Ejemplo Completo de Cliente

```javascript
// 1. Importar socket.io
import io from 'socket.io-client';

// 2. Obtener token JWT (después de login)
const token = localStorage.getItem('jwt_token');

// 3. Conectar con autenticación
const socket = io('ws://localhost:3000', {
  auth: { token }
});

// 4. Manejar conexión
socket.on('connect', () => {
  console.log('✅ Conectado al servidor');
});

socket.on('disconnect', (reason) => {
  console.log('❌ Desconectado:', reason);
});

// 5. Unirse a sesión
function unirseASesion(sessionId) {
  socket.emit('join_session', { sessionId });
}

socket.on('joined_successfully', (data) => {
  console.log(`Unido a sesión ${data.sessionId}`);
  console.log(`Conectados: ${data.connectedCount}`);
});

// 6. Escuchar usuarios
socket.on('user.joined_session', (data) => {
  actualizarListaUsuarios();
});

socket.on('user.left_session', (data) => {
  actualizarListaUsuarios();
});

// 7. Chat
function enviarMensaje(sessionId, mensaje) {
  socket.emit('send_message', { sessionId, message: mensaje });
}

socket.on('chat.message_sent', (data) => {
  agregarMensajeAlChat(data);
});

// 8. Preguntas
function hacerPregunta(sessionId, pregunta) {
  socket.emit('ask_question', { sessionId, question: pregunta });
}

socket.on('question.asked', (data) => {
  agregarPreguntaDestacada(data);
});

// 9. Eventos de sesión
socket.on('session.started', (data) => {
  habilitarChat();
  mostrarNotificacion('¡La clase ha comenzado!');
});

socket.on('session.ended', (data) => {
  deshabilitarChat();
  mostrarResumen();
  socket.disconnect();
});

// 10. Errores
socket.on('error', (data) => {
  mostrarError(data.message);
});
```

---

## 📁 Ubicación del Código

| Archivo | Descripción |
|---------|-------------|
| `src/sesiones/session.gateway.ts` | Gateway principal de WebSocket |
| `src/asistencias/asistencias.service.ts` | Lógica de asistencia automática |
| `src/participaciones/participaciones.service.ts` | Registro de participaciones |
| `src/inscripciones/entities/inscripcion.entity.ts` | Validación de inscripciones |
