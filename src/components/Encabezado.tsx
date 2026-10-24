import type { Equipo } from "../types";

interface EncabezadoProps {
  titulo: string;
  equipos: Equipo[];
}

export default function Encabezado({ titulo, equipos }: EncabezadoProps) {
  const disponibles = equipos.filter((e) => e.disponible).length;

  return (
    <header className="encabezado">
      <h1>{titulo}</h1>
      <p>
        {disponibles} de {equipos.length} equipos disponibles
      </p>
    </header>
  );
}