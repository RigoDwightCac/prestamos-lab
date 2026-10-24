import type { Equipo, Prestamo } from "../types";

interface PrestamosActivosProps {
  prestamos: Prestamo[];
  equipos: Equipo[];
  onDevolver: (prestamoId: number) => void;
}

// Fecha de hoy como AAAA-MM-DD en hora local
function hoyTexto(): string {
  const f = new Date();
  const mes = String(f.getMonth() + 1).padStart(2, "0");
  const dia = String(f.getDate()).padStart(2, "0");
  return `${f.getFullYear()}-${mes}-${dia}`;
}

// De AAAA-MM-DD a DD/MM/AAAA
function formatear(fecha: string): string {
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
}

export default function PrestamosActivos({
  prestamos,
  equipos,
  onDevolver,
}: PrestamosActivosProps) {
  const hoy = hoyTexto();

  // Variante 8/9: ordenar por fecha límite, el más próximo primero.
  // Se copia el arreglo con [...] porque sort modifica el original.
  const activos = [...prestamos]
    .filter((p) => !p.devuelto)
    .sort((a, b) => a.fechaLimite.localeCompare(b.fechaLimite));

  if (activos.length === 0) {
    return <p className="vacio">No hay préstamos activos.</p>;
  }

  return (
    <table className="tabla">
      <thead>
        <tr>
          <th>Equipo</th>
          <th>Solicitante</th>
          <th>Fecha límite</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        {activos.map((p) => {
          const vencido = p.fechaLimite < hoy;
          const equipo = equipos.find((e) => e.id === p.equipoId);

          return (
            <tr key={p.id} className={vencido ? "vencido" : ""}>
              <td>{equipo ? equipo.nombre : "Equipo desconocido"}</td>
              <td>{p.solicitante}</td>
              <td>
                {formatear(p.fechaLimite)}
                {vencido && <span className="etiqueta roja"> Vencido</span>}
              </td>
              <td>
                <button className="btn" onClick={() => onDevolver(p.id)}>
                  Devolver
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}