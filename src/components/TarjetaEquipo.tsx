import type { Equipo } from "../types";

interface TarjetaEquipoProps {
  equipo: Equipo;
  onPrestar: (id: number) => void;
}

export default function TarjetaEquipo({ equipo, onPrestar }: TarjetaEquipoProps) {
  return (
    <article className="tarjeta">
      <h3>{equipo.nombre}</h3>
      <p className="categoria">{equipo.categoria}</p>
      <span className={`etiqueta ${equipo.disponible ? "verde" : "roja"}`}>
        {equipo.disponible ? "Disponible" : "Prestado"}
      </span>
      <button
        className="btn"
        disabled={!equipo.disponible}
        onClick={() => onPrestar(equipo.id)}
      >
        Prestar
      </button>
    </article>
  );
}