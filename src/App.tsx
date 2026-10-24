import { useState } from "react";
import "./App.css";
import { TITULO_APP } from "./config";
import type { Equipo } from "./types";
import { useEquipos } from "./hooks/useEquipos";
import { usePrestamos } from "./hooks/usePrestamos";
import {
  crearPrestamo,
  actualizarDisponibilidad,
  marcarDevuelto,
} from "./services/api";
import Encabezado from "./components/Encabezado";
import ListaEquipos from "./components/ListaEquipos";
import Filtros from "./components/Filtros";
import FormularioPrestamo from "./components/FormularioPrestamo";
import type { DatosPrestamo } from "./components/FormularioPrestamo";
import PrestamosActivos from "./pages/PrestamosActivos";

type Vista = "inventario" | "prestamos";

export default function App() {
  const {
    equipos,
    setEquipos,
    cargando: cargandoEquipos,
    error: errorEquipos,
    reintentar: reintentarEquipos,
  } = useEquipos();
  const {
    prestamos,
    setPrestamos,
    cargando: cargandoPrestamos,
    error: errorPrestamos,
    reintentar: reintentarPrestamos,
  } = usePrestamos();

  const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>(null);
  const [vista, setVista] = useState<Vista>("inventario");
  const [categoria, setCategoria] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [errorAccion, setErrorAccion] = useState<string | null>(null);

  const categorias = [...new Set(equipos.map((e) => e.categoria))];

  const equiposFiltrados = equipos.filter(
    (e) =>
      (categoria === "" || e.categoria === categoria) &&
      e.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())
  );

  const manejarPrestar = (id: number) => {
    const equipo = equipos.find((e) => e.id === id);
    if (equipo) setEquipoSeleccionado(equipo);
  };

  // Si algo falla, lanza el error: el formulario lo captura y lo muestra
  const manejarGuardar = async (datos: DatosPrestamo) => {
    if (!equipoSeleccionado) return;

    const creado = await crearPrestamo({
      equipoId: equipoSeleccionado.id,
      solicitante: datos.solicitante,
      carne: datos.carne,
      fechaPrestamo: new Date().toISOString(),
      fechaLimite: datos.fechaLimite,
      devuelto: false,
    });
    await actualizarDisponibilidad(equipoSeleccionado.id, false);

    // La API ya guardó: ahora se actualiza la interfaz (de forma inmutable)
    setPrestamos([...prestamos, creado]);
    setEquipos(
      equipos.map((e) =>
        e.id === equipoSeleccionado.id ? { ...e, disponible: false } : e
      )
    );
    setEquipoSeleccionado(null);
  };

  const manejarDevolver = async (prestamoId: number) => {
    const prestamo = prestamos.find((p) => p.id === prestamoId);
    if (!prestamo) return;

    setErrorAccion(null);
    try {
      await marcarDevuelto(prestamoId);
      await actualizarDisponibilidad(prestamo.equipoId, true);

      setPrestamos(
        prestamos.map((p) => (p.id === prestamoId ? { ...p, devuelto: true } : p))
      );
      setEquipos(
        equipos.map((e) =>
          e.id === prestamo.equipoId ? { ...e, disponible: true } : e
        )
      );
    } catch {
      setErrorAccion("No se pudo registrar la devolución. Intente de nuevo.");
    }
  };

  const contenidoInventario = () => {
    if (cargandoEquipos) {
      return (
        <div className="estado">
          <div className="spinner" />
          <p>Cargando inventario...</p>
        </div>
      );
    }

    if (errorEquipos) {
      return (
        <div className="mensaje-error">
          <p>{errorEquipos}</p>
          <button className="btn" onClick={reintentarEquipos}>
            Reintentar
          </button>
        </div>
      );
    }

    return (
      <>
        <Filtros
          categorias={categorias}
          categoria={categoria}
          busqueda={busqueda}
          onCategoria={setCategoria}
          onBusqueda={setBusqueda}
        />
        {equiposFiltrados.length === 0 ? (
          <p className="vacio">No se encontraron equipos.</p>
        ) : (
          <ListaEquipos equipos={equiposFiltrados} onPrestar={manejarPrestar} />
        )}
      </>
    );
  };

  const contenidoPrestamos = () => {
    if (cargandoPrestamos) {
      return (
        <div className="estado">
          <div className="spinner" />
          <p>Cargando préstamos...</p>
        </div>
      );
    }

    if (errorPrestamos) {
      return (
        <div className="mensaje-error">
          <p>{errorPrestamos}</p>
          <button className="btn" onClick={reintentarPrestamos}>
            Reintentar
          </button>
        </div>
      );
    }

    return (
      <>
        {errorAccion && (
          <div className="mensaje-error" style={{ marginBottom: 16 }}>
            <p>{errorAccion}</p>
          </div>
        )}
        <PrestamosActivos
          prestamos={prestamos}
          equipos={equipos}
          onDevolver={manejarDevolver}
        />
      </>
    );
  };

  return (
    <>
      <Encabezado titulo={TITULO_APP} equipos={equipos} />
      <main className="contenedor">
        <nav className="pestanas">
          <button
            className={`pestana ${vista === "inventario" ? "activa" : ""}`}
            onClick={() => setVista("inventario")}
          >
            Inventario
          </button>
          <button
            className={`pestana ${vista === "prestamos" ? "activa" : ""}`}
            onClick={() => setVista("prestamos")}
          >
            Préstamos activos
          </button>
        </nav>

        {vista === "inventario" ? contenidoInventario() : contenidoPrestamos()}
      </main>

      {equipoSeleccionado && (
        <FormularioPrestamo
          equipo={equipoSeleccionado}
          onGuardar={manejarGuardar}
          onCancelar={() => setEquipoSeleccionado(null)}
        />
      )}
    </>
  );
}