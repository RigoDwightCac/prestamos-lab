import { useEffect, useState } from "react";
import type { Equipo } from "../types";
import { obtenerEquipos } from "../services/api";

export function useEquipos() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    // Evita actualizar el estado si el componente se desmonta antes de que llegue la respuesta
    let cancelado = false;

    obtenerEquipos()
      .then((datos) => {
        if (!cancelado) {
          setEquipos(datos);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelado) {
          setError(
            "No se pudo cargar el inventario. Verifique que la API esté encendida e intente de nuevo."
          );
        }
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [intento]); // Se vuelve a ejecutar cada vez que cambia "intento"

  // Botón Reintentar: muestra "cargando" otra vez y dispara una nueva carga
  const reintentar = () => {
    setCargando(true);
    setError(null);
    setIntento((n) => n + 1);
  };

  return { equipos, setEquipos, cargando, error, reintentar };
}