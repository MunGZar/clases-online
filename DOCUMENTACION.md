# 📚 Plataforma de Clases Online - Documentación Completa

## 📋 Descripción del Proyecto

Sistema de backend para una plataforma de clases en línea que permite:
- **Profesores**: Crear cursos y sesiones en vivo
- **Estudiantes**: Inscribirse a cursos y participar en tiempo real
- **Sala en tiempo real**: Chat, lista de asistentes, preguntas
- **Control automático**: Asistencia y participación

---

## 🏗️ Arquitectura del Proyecto

```
src/
├── main.ts                    # Bootstrap de la aplicación
├── app.module.ts              # Módulo principal
├── seed.ts                    # Datos iniciales
│
├── auth/                      # Módulo de autenticación
│   ├── auth.controller.ts     # Endpoints: login, profile
│   ├── auth.service.ts        # Lógica de autenticación
│   ├── dto/login.dto.ts       # DTO con validaciones
│   ├── guards/
│   │   ├── jwt-auth.guard.ts  # Guard JWT
│   │   └── roles.guard.ts     # Guard por roles
│   ├── decorators/
│   │   └── roles.decorator.ts # Decorador @Roles()
│   └── strategies/
│       └── jwt.strategy.ts    # Estrategia Passport JWT
│
├── usuarios/                  # Módulo de usuarios
│   ├── usuarios.controller.ts # CRUD usuarios (solo admin)
│   ├── usuario.service.ts     # Lógica de usuarios
│   ├── dto/create-user.dto.ts # DTO de creación
│   └── entities/usuario.entity.ts
│
├── cursos/                    # Módulo de cursos
│   ├── cursos.controller.ts   # CRUD cursos
│   ├── cursos.service.ts      # Lógica con filtros/paginación
│   ├── dto/
│   │   ├── create-curso.dto.ts   # @ApiProperty decoradores
│   │   ├── query-cursos.dto.ts   # Filtros: profesorId, etiqueta, estado
│   │   └── update-curso.dto.ts
│   └── entities/curso.entity.ts
│
├── sesiones/                  # Módulo de sesiones
│   ├── sesiones.controller.ts # CRUD + iniciar/finalizar
│   ├── sesiones.service.ts    # Lógica con validaciones de tiempo
│   ├── session.gateway.ts     # ⭐ WebSocket Gateway
│   ├── websocket-events.docs.md # Documentación WebSocket
│   ├── dto/
│   │   ├── create-sesion.dto.ts  # inicioAt, finAt
│   │   └── query-sesiones.dto.ts # Filtros: cursoId, estado, fechas
│   └── entities/sesion.entity.ts
│
├── inscripciones/             # Módulo de inscripciones
│   ├── inscripciones.controller.ts # CRUD + aprobar
│   ├── inscripciones.service.ts    # Validación cupo máximo
│   ├── dto/
│   │   ├── crear-inscripcion.dto.ts
│   │   └── query-inscripciones.dto.ts
│   └── entities/inscripcion.entity.ts
│
├── asistencias/               # Módulo de asistencias
│   ├── asistencia.controller.ts   # conectar/desconectar/evaluar
│   ├── asistencias.service.ts     # Lógica de presencia automática
│   ├── dto/create-asistencia.dto.ts # DTOs tipados
│   └── entities/asistencia.entity.ts
│
├── participaciones/           # Módulo de participaciones
│   ├── participaciones.controller.ts
│   ├── participaciones.service.ts
│   ├── dto/create.participaciones.dto.ts
│   └── entities/participacion.entity.ts
│
└── common/                    # Middlewares comunes
    └── educational-context.middleware.ts
```

---

## 🔐 Seguridad Implementada

### 1. CORS (main.ts)
```typescript
app.enableCors({
  origin: [
    'https://frontend-estudiantes.com',
    'https://frontend-profesores.com',
    'http://localhost:3000',
    // ...desarrollo
  ],
  credentials: true,
});
```
> **Ubicación:** `src/main.ts` líneas 13-27

### 2. Helmet
```typescript
app.use(helmet());
```
> **Ubicación:** `src/main.ts` línea 11

### 3. JWT Authentication
- **Guard:** `src/auth/guards/jwt-auth.guard.ts`
- **Strategy:** `src/auth/strategies/jwt.strategy.ts`
- **Uso:** `@UseGuards(JwtAuthGuard)` en controllers

### 4. Role-Based Access Control
```typescript
@Roles('profesor', 'estudiante')
@UseGuards(JwtAuthGuard, RolesGuard)
```
- **Guard:** `src/auth/guards/roles.guard.ts`
- **Decorador:** `src/auth/decorators/roles.decorator.ts`

### 5. Validación Global
```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,  // Elimina propiedades no definidas
  transform: true,  // Transforma tipos automáticamente
}));
```

---

## 📡 API REST Endpoints

### Auth
| Método | Endpoint | Rol | Descripción |
|--------|----------|-----|-------------|
| POST | `/auth/login` | Público | Login: `{email, password}` |
| GET | `/auth/profile` | Autenticado | Obtener perfil |

### Usuarios
| Método | Endpoint | Rol | Descripción |
|--------|----------|-----|-------------|
| POST | `/usuarios` | admin | Crear usuario |
| GET | `/usuarios` | admin | Listar usuarios |
| GET | `/usuarios/:id` | admin | Obtener usuario |
| DELETE | `/usuarios/:id` | admin | Eliminar usuario |

### Cursos
| Método | Endpoint | Rol | Descripción |
|--------|----------|-----|-------------|
| POST | `/cursos` | profesor | Crear curso (requiere `profesorId`) |
| GET | `/cursos` | profesor, estudiante | Listar con filtros |
| GET | `/cursos/:id` | profesor, estudiante | Obtener curso |
| PATCH | `/cursos/:id` | profesor | Actualizar |
| DELETE | `/cursos/:id` | profesor | Eliminar |

**Filtros GET /cursos:** `page`, `limit`, `profesorId`, `etiqueta`, `estado`

### Sesiones
| Método | Endpoint | Rol | Descripción |
|--------|----------|-----|-------------|
| POST | `/sesiones` | profesor | Crear sesión |
| GET | `/sesiones` | profesor, estudiante | Listar con filtros |
| GET | `/sesiones/:id` | profesor, estudiante | Obtener sesión |
| PATCH | `/sesiones/:id/iniciar` | profesor | Iniciar (requiere `actorId`) |
| PATCH | `/sesiones/:id/finalizar` | profesor | Finalizar (requiere `actorId`) |

**Filtros GET /sesiones:** `page`, `limit`, `cursoId`, `estado`, `fechaDesde`, `fechaHasta`

### Inscripciones
| Método | Endpoint | Rol | Descripción |
|--------|----------|-----|-------------|
| POST | `/inscripciones` | estudiante, profesor, admin | Inscribir (requiere `estudianteId`) |
| GET | `/inscripciones` | profesor, admin | Listar |
| GET | `/inscripciones/:id` | profesor, estudiante, admin | Obtener |
| GET | `/inscripciones/curso/:cursoId` | profesor, admin | Por curso |
| PATCH | `/inscripciones/:id/aprobar` | profesor, admin | Aprobar |
| DELETE | `/inscripciones/:id` | profesor, admin | Eliminar |

### Asistencias
| Método | Endpoint | Rol | Descripción |
|--------|----------|-----|-------------|
| POST | `/asistencias/conectar` | estudiante | Marcar conexión |
| POST | `/asistencias/desconectar` | estudiante | Marcar desconexión |
| POST | `/asistencias/evaluar` | profesor | Evaluar presencia |
| GET | `/asistencias/sesion/:id` | profesor, estudiante | Listar por sesión |

### Participaciones
| Método | Endpoint | Rol | Descripción |
|--------|----------|-----|-------------|
| POST | `/participaciones` | estudiante | Crear participación |
| GET | `/participaciones/sesion/:id` | profesor, estudiante | Listar por sesión |

---

## 🔌 WebSocket Events

**Archivo:** `src/sesiones/session.gateway.ts`

### Cliente → Servidor
| Evento | Payload | Descripción |
|--------|---------|-------------|
| `join_session` | `{sessionId}` | Unirse a sesión |
| `send_message` | `{sessionId, message}` | Enviar mensaje |
| `ask_question` | `{sessionId, question}` | Hacer pregunta |

### Servidor → Cliente
| Evento | Payload | Descripción |
|--------|---------|-------------|
| `joined_successfully` | `{sessionId, connectedCount}` | Confirmación |
| `user.joined_session` | `{userId, sessionId, connectedCount}` | Usuario conectado |
| `user.left_session` | `{userId, sessionId, connectedCount}` | Usuario desconectado |
| `chat.message_sent` | `{userId, sessionId, message}` | Nuevo mensaje |
| `question.asked` | `{userId, sessionId, question}` | Nueva pregunta |
| `session.started` | `{sessionId}` | Sesión iniciada |
| `session.ended` | `{sessionId}` | Sesión finalizada |
| `error` | `{message}` | Error |

> Ver documentación completa: `src/sesiones/websocket-events.docs.md`

---

## 🎯 Decoradores Swagger (@ApiProperty)

Todos los DTOs usan decoradores de Swagger para documentación:

```typescript
// Ejemplo: src/cursos/dto/create-curso.dto.ts
@ApiProperty({
  description: 'Título del curso',
  example: 'Programación en Python',
})
@IsString()
@IsNotEmpty()
titulo: string;
```

**Archivos con decoradores:**
- `src/cursos/dto/create-curso.dto.ts`
- `src/cursos/dto/query-cursos.dto.ts`
- `src/sesiones/dto/create-sesion.dto.ts`
- `src/sesiones/dto/query-sesiones.dto.ts`
- `src/inscripciones/dto/crear-inscripcion.dto.ts`
- `src/asistencias/dto/create-asistencia.dto.ts`
- `src/participaciones/dto/create.participaciones.dto.ts`

---

## ⚙️ Configuración

### Variables de Entorno (.env)
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_password
DB_NAME=clases_online
PORT=3000
JWT_SECRET=tu_clave_secreta
```

### Scripts (package.json)
```bash
npm run start:dev   # Desarrollo con watch
npm run seed        # Cargar datos iniciales
npm run build       # Compilar producción
npm run start:prod  # Ejecutar producción
npm run test        # Tests unitarios
npm run test:e2e    # Tests e2e
```

---

## 🚀 Guía de Uso Rápido

### 1. Instalación
```bash
npm install
npm run seed
npm run start:dev
```

### 2. Swagger
Abrir: http://localhost:3000/api/docs

### 3. Login
```json
POST /auth/login
{
  "email": "profesor@test.com",
  "password": "123456"
}
```

### 4. Crear Curso (Profesor)
```json
POST /cursos
{
  "titulo": "Python Avanzado",
  "descripcion": "Curso completo",
  "cupoMaximo": 30,
  "etiquetas": ["python"],
  "profesorId": 1
}
```

### 5. Crear Sesión
```json
POST /sesiones
{
  "titulo": "Clase 1",
  "cursoId": 1,
  "inicioAt": "2025-12-15 10:00:00",
  "finAt": "2025-12-15 12:00:00"
}
```

### 6. Iniciar Sesión
```json
PATCH /sesiones/{id}/iniciar
{
  "actorId": 1
}
```

### 7. WebSocket
Abrir: `websocket-tester.html` en navegador

---

## 🧹 Archivos que Pueden Eliminarse

| Archivo | Razón |
|---------|-------|
| `src/verify-api.ts` | Script de prueba |
| `src/verify-full-flow.ts` | Script de prueba |
| `src/verify-system.ts` | Script de prueba |
| `test/check-db.ts` | Script de prueba DB |
| `swagger-spec.json` | JSON exportado (se genera dinámicamente) |
| `guia-completa.md.resolved` | Archivo temporal |
| `walkthrough.md.resolved` | Archivo temporal |

**Comando para eliminar:**
```bash
del src\verify-api.ts src\verify-full-flow.ts src\verify-system.ts
del test\check-db.ts swagger-spec.json
del guia-completa.md.resolved walkthrough.md.resolved
```

---

## 📁 Archivos Importantes que Conservar

| Archivo | Propósito |
|---------|-----------|
| `src/sesiones/websocket-events.docs.md` | Documentación WebSocket |
| `test/clases-online.postman_collection.json` | Colección Postman |
| `websocket-tester.html` | Herramienta de prueba WebSocket |
| `.env` | Configuración (no subir a git) |

---

## 👥 Usuarios de Prueba (seed.ts)

| Email | Password | Rol |
|-------|----------|-----|
| profesor@test.com | 123456 | profesor |
| estudiante@test.com | 123456 | estudiante |
| admin@test.com | 123456 | admin |
