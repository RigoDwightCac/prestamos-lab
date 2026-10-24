# Préstamos Lab — 0902-23-10299

Aplicación web para controlar qué equipo del laboratorio de cómputo está prestado, a quién y hasta cuándo. Hecha con React + TypeScript (Vite) y una API REST simulada con json-server.

**Variante asignada (carné terminado en 9):**
- Categorías: Switch, Cable de red, Access Point
- Máximo de días de préstamo: 4
- Regla adicional: la tabla de préstamos activos se ordena por fecha límite, el más próximo primero

## Requisitos

- Node.js 18 o superior
- npm

## Instalación

1. Clonar el repositorio e ingresar a la carpeta:

   ```bash
   git clone https://github.com/RigoDwightCac/prestamos-lab.git
   cd prestamos-lab
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Crear un archivo `.env` en la raíz del proyecto (junto a `package.json`) con la URL de la API:

   ```
   VITE_API_URL=http://localhost:3001
   ```

## Levantar la API (json-server)

En una terminal:

```bash
npm run api
```

La API queda disponible en `http://localhost:3001` y guarda sus datos en `db.json`.

Endpoints usados:

| Método | Endpoint | Uso |
|---|---|---|
| GET | /equipos | Cargar el inventario |
| GET | /prestamos?devuelto=false | Cargar préstamos activos |
| POST | /prestamos | Registrar un préstamo |
| PATCH | /equipos/:id | Cambiar disponibilidad |
| PATCH | /prestamos/:id | Marcar como devuelto |

## Ejecutar el frontend

En **otra** terminal:

```bash
npm run dev
```

Abrir en el navegador la dirección que indica la terminal (normalmente `http://localhost:5173`).

## Estructura del proyecto

```
src/
  components/   componentes de presentación
  hooks/        custom hooks (useEquipos, usePrestamos)
  pages/        vistas principales
  services/     funciones que llaman a la API
  types/        interfaces TypeScript
  App.tsx
```