import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Equipo } from "../types";

const DIAS_MAXIMOS = 4;
const REGEX_CARNE = /^\d{4}-\d{2}-\d{5}$/;

export interface DatosPrestamo {
  solicitante: string;
  carne: string;
  fechaLimite: string;
}

interface FormularioPrestamoProps {
  equipo: Equipo;
  onGuardar: (datos: DatosPrestamo) => void;
  onCancelar: () => void;
}

interface Errores {
  solicitante?: string;
  carne?: string;
  fechaLimite?: string;
}

// Formatea una fecha como AAAA-MM-DD usando la hora local
// (toISOString usaría UTC y en Guatemala, de noche, daría el día siguiente)
function aTexto(fecha: Date): string {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

export default function FormularioPrestamo({
  equipo,
  onGuardar,
  onCancelar,
}: FormularioPrestamoProps) {
  const [datos, setDatos] = useState<DatosPrestamo>({
    solicitante: "",
    carne: "",
    fechaLimite: "",
  });
  const [errores, setErrores] = useState<Errores>({});

  const hoy = aTexto(new Date());
  const limite = new Date();
  limite.setDate(limite.getDate() + DIAS_MAXIMOS);
  const maxima = aTexto(limite);

  const manejarCambio = (ev: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = ev.target;
    setDatos({ ...datos, [name]: value });
  };

  const validar = (): Errores => {
    const e: Errores = {};

    if (!datos.solicitante.trim()) {
      e.solicitante = "El solicitante es obligatorio.";
    } else if (datos.solicitante.trim().length < 5) {
      e.solicitante = "Debe tener al menos 5 caracteres.";
    }

    if (!REGEX_CARNE.test(datos.carne)) {
      e.carne = "Formato inválido. Use 0000-00-00000.";
    }

    if (!datos.fechaLimite) {
      e.fechaLimite = "La fecha límite es obligatoria.";
    } else if (datos.fechaLimite < hoy) {
      e.fechaLimite = "No puede ser anterior a hoy.";
    } else if (datos.fechaLimite > maxima) {
      e.fechaLimite = `No puede superar ${DIAS_MAXIMOS} días desde hoy (máximo ${maxima}).`;
    }

    return e;
  };

  const manejarEnvio = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const nuevosErrores = validar();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      onGuardar({
        solicitante: datos.solicitante.trim(),
        carne: datos.carne,
        fechaLimite: datos.fechaLimite,
      });
    }
  };

  return (
    <div className="modal-fondo">
      <form className="modal" onSubmit={manejarEnvio} noValidate>
        <h2>Prestar equipo</h2>
        <p className="modal-equipo">{equipo.nombre}</p>

        <label>
          Solicitante
          <input
            type="text"
            name="solicitante"
            value={datos.solicitante}
            onChange={manejarCambio}
            placeholder="Nombre completo"
          />
          {errores.solicitante && <span className="error">{errores.solicitante}</span>}
        </label>

        <label>
          Carné
          <input
            type="text"
            name="carne"
            value={datos.carne}
            onChange={manejarCambio}
            placeholder="0000-00-00000"
          />
          {errores.carne && <span className="error">{errores.carne}</span>}
        </label>

        <label>
          Fecha límite (máximo {DIAS_MAXIMOS} días)
          <input
            type="date"
            name="fechaLimite"
            value={datos.fechaLimite}
            onChange={manejarCambio}
            min={hoy}
            max={maxima}
          />
          {errores.fechaLimite && <span className="error">{errores.fechaLimite}</span>}
        </label>

        <div className="modal-botones">
          <button type="button" className="btn btn-secundario" onClick={onCancelar}>
            Cancelar
          </button>
          <button type="submit" className="btn">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}