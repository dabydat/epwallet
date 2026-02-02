# e Wallet: Arquitectura de Billetera Virtual

Este proyecto implementa una solución de **E-Wallet (Billetera Electrónica)** diseñada con un enfoque en robustez, integridad de datos y escalabilidad. La arquitectura sigue los principios de **Clean Architecture** y **Domain-Driven Design (DDD)**, asegurando una separación clara de responsabilidades y un núcleo de negocio desacoplado de la infraestructura.

---

## 🏗️ Arquitectura y Diseño

El sistema está organizado en capas para garantizar mantenibilidad y facilitar el testing:

| Capa | Responsabilidad Principal | Elementos Clave |
| :--- | :--- | :--- |
| **Domain** | Núcleo de la lógica de negocio. Independiente de frameworks. | Entities, Value Objects, Domain Exceptions, Repository Interfaces. |
| **Application** | Orquestación de la lógica de negocio. | Use Cases, DTOs, Query Objects. |
| **Infrastructure** | Implementaciones concretas de herramientas externas y frameworks. | TypeORM Entities, Mappers, Repositories Impl, Redis Integration, Controllers. |
| **Shared** | Utilidades y abstracciones comunes a todo el sistema. | Base Value Objects, Global Filters, Interceptors. |

### 🛠️ Tecnologías Principales

- **Backend:** NestJS (Node.js), TypeScript.
- **Persistencia:** MySQL 8.0 con TypeORM.
- **Cache & Integridad:** Redis (para idempotencia y gestión de tokens).
- **Frontend:** React (Vite), TypeScript.
- **Orquestación:** Docker & Docker Compose.

### 🌟 Patrones y Principios Aplicados

- **Value Objects (DDD):** Implementación de objetos como `Amount` (manejo de céntimos para evitar errores de precisión), `UtcDate` (estandarización de fechas en UTC), `Uuid`, `Email`, `DocumentVO`, `PhoneNumber` y `Name`.
- **Repository Pattern:** Desacoplamiento total de la lógica de acceso a datos.
- **Unit of Work:** Gestión de transacciones atómicas para asegurar la consistencia en operaciones complejas (ej. recarga + transacción).
- **Idempotencia:** Implementada mediante un `IdempotencyInterceptor` y Redis para evitar procesar la misma transacción múltiples veces (especialmente en recargas y pagos).
- **BFF (Backend for Frontend) Pattern:** El backend actúa como un orquestador que transforma los modelos de dominio en respuestas optimizadas para la UI mediante mappers específicos.

---

## 🚀 Proceso de Levantamiento y Ejecución

La arquitectura completa se puede desplegar fácilmente utilizando **Docker Compose**.

### 1. Configuración del Entorno (`.env`)

Está creado un archivo llamado "init.sh" en la raiz del repositorio, que una vez ejecutado creará el archivo .env necesario con los datos correspondientes, se encargará de coinstruir y levantar los contenedores. Esta opción fue creada para hacer sencillo el proceso de levantamiento y configuración del proyecto. Para pdoer ejecutar el archivo, deben darle permisos de ejecución con el siguiente comando: sudo chmod +x init.sh

Para los equipos con OS Windows, es importante tener WSL o alguna distribución de linux instalada para su ejecución en la terminal dedicada a la distribución de Linux y el Docker Desktop activo. 

Si no se quiere ejecutar el archivo "init.sh" se puede hacer de forma manual explicado en las lineas siguientes.

Asegúrate de configurar los archivos de entorno necesarios:

- **Backend:** Copia `backend/.env.example` a `backend/.env`.

### 2. Despliegue con un Solo Comando

Ejecuta el siguiente comando en la raíz del proyecto:

```bash
docker compose up --build -d
```

### 3. Verificación de Servicios

Una vez levantados, verifica el estado de los contenedores:

```bash
docker compose ps
```

Deberías ver:
- `ewallet_backend` (NestJS)
- `ewallet_frontend` (React)
- `ewallet_db` (MySQL)
- `ewallet_redis` (Redis)

### 4. Acceso a la Aplicación

- **Frontend:** [http://localhost:80](http://localhost:80)
- **API (Backend):** [http://localhost:3000/api/v1](http://localhost:3000/api/v1)

---

## 🖥️ Frontend (Interfaz de Usuario)

El frontend está construido con **React**, enfocado en una experiencia de usuario fluida y una lógica de estados clara.

| Característica | Descripción |
| :--- | :--- |
| **Arquitectura de UI** | Basada en componentes reutilizables y servicios desacoplados. |
| **Estilos** | CSS moderno con enfoque en responsividad y estética premium. |
| **Validación** | Integración directa con los esquemas de validación del backend para una experiencia coherente. |

---

## 🧪 Uso y Pruebas de la API

Se incluye una colección de Postman en la raíz del proyecto para facilitar las pruebas:

- **Archivo:** `e_wallet_api.postman_collection.json`

### Flujos Principales:
1. **Registro de Cliente:** Crea un nuevo usuario con documento, email y teléfono.
2. **Recarga de Billetera:** Añade fondos (idempotente).
3. **Solicitud de Pago:** Genera un token de confirmación enviado por email (simulado o real).
4. **Confirmación de Pago:** Valida el token y descuenta el saldo (transaccional).
5. **Consulta de Saldo:** Retorna el balance actual en formato decimal.

## A tomar en cuenta

El Token de Confirmación de pago se generará y se mostrará en el Contenedor Docker del Backend, y puede visualizarse de la siguiente forma:

[Nest] 1  - 02/02/2026, 6:56:07 PM     LOG [ConsoleNotificationService] [EMAIL SENT] To: correo@gmail.com | Token: 123456

---

## 🧹 Detener y Limpiar

Para detener y eliminar los contenedores (manteniendo datos):
```bash
docker compose stop
docker compose rm -f
```

Para una limpieza total (incluyendo volúmenes de datos):
```bash
docker compose down -v
```
