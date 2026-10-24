import { useEffect, useState } from "react";
import type { Prestamo } from "../types";
import { obtenerPrestamosActivos } from "../services/api";

export function usePrestamos() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let cancelado = false;

    obtenerPrestamosActivos()
      .then((datos) => {
        if (!cancelado) {
          setPrestamos(datos);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelado) {
          setError("No se pudieron cargar los préstamos. Intente de nuevo.");
        }
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [intento]);

  const reintentar = () => {
    setCargando(true);
    setError(null);
    setIntento((n) => n + 1);
  };

  return { prestamos, setPrestamos, cargando, error, reintentar };
}