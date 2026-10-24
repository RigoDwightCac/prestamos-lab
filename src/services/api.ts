import type { Equipo, Prestamo } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

// Si la respuesta no es 2xx, lanza un error (fetch no lo hace solo)
async function procesar<T>(respuesta: Response): Promise<T> {
  if (!respuesta.ok) {
    throw new Error(`Error del servidor (código ${respuesta.status})`);
  }
  return respuesta.json() as Promise<T>;
}

export async function obtenerEquipos(): Promise<Equipo[]> {
  const respuesta = await fetch(`${API_URL}/equipos`);
  return procesar<Equipo[]>(respuesta);
}

export async function obtenerPrestamosActivos(): Promise<Prestamo[]> {
  const respuesta = await fetch(`${API_URL}/prestamos?devuelto=false`);
  return procesar<Prestamo[]>(respuesta);
}

export async function crearPrestamo(
  prestamo: Omit<Prestamo, "id">
): Promise<Prestamo> {
  const respuesta = await fetch(`${API_URL}/prestamos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prestamo),
  });
  return procesar<Prestamo>(respuesta);
}

export async function actualizarDisponibilidad(
  id: number,
  disponible: boolean
): Promise<Equipo> {
  const respuesta = await fetch(`${API_URL}/equipos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ disponible }),
  });
  return procesar<Equipo>(respuesta);
}

export async function marcarDevuelto(id: number): Promise<Prestamo> {
  const respuesta = await fetch(`${API_URL}/prestamos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ devuelto: true }),
  });
  return procesar<Prestamo>(respuesta);
}