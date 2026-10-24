import { useState } from "react";
import "./App.css";
import { TITULO_APP } from "./config";
import type { Prestamo, Equipo } from "./types";
import { useEquipos } from "./hooks/useEquipos";
import Encabezado from "./components/Encabezado";
import ListaEquipos from "./components/ListaEquipos";
import Filtros from "./components/Filtros";
import FormularioPrestamo from "./components/FormularioPrestamo";
import type { DatosPrestamo } from "./components/FormularioPrestamo";
import PrestamosActivos from "./pages/PrestamosActivos";

type Vista = "inventario" | "prestamos";

export default function App() {
  const { equipos, setEquipos, cargando, error, reintentar } = useEquipos();
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>(null);
  const [vista, setVista] = useState<Vista>("inventario");
  const [categoria, setCategoria] = useState("");
  const [busqueda, setBusqueda] = useState("");

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

  const manejarGuardar = (datos: DatosPrestamo) => {
    if (!equipoSeleccionado) return;

    const nuevoPrestamo: Prestamo = {
      id: prestamos.length > 0 ? Math.max(...prestamos.map((p) => p.id)) + 1 : 1,
      equipoId: equipoSeleccionado.id,
      solicitante: datos.solicitante,
      carne: datos.carne,
      fechaPrestamo: new Date().toISOString(),
      fechaLimite: datos.fechaLimite,
      devuelto: false,
    };

    setPrestamos([...prestamos, nuevoPrestamo]);
    setEquipos(
      equipos.map((e) =>
        e.id === equipoSeleccionado.id ? { ...e, disponible: false } : e
      )
    );
    setEquipoSeleccionado(null);
  };

  const manejarDevolver = (prestamoId: number) => {
    const prestamo = prestamos.find((p) => p.id === prestamoId);
    if (!prestamo) return;

    setPrestamos(
      prestamos.map((p) => (p.id === prestamoId ? { ...p, devuelto: true } : p))
    );
    setEquipos(
      equipos.map((e) =>
        e.id === prestamo.equipoId ? { ...e, disponible: true } : e
      )
    );
  };

  const contenidoInventario = () => {
    if (cargando) {
      return (
        <div className="estado">
          <div className="spinner" />
          <p>Cargando inventario...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="mensaje-error">
          <p>{error}</p>
          <button className="btn" onClick={reintentar}>
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

        {vista === "inventario" ? (
          contenidoInventario()
        ) : (
          <PrestamosActivos
            prestamos={prestamos}
            equipos={equipos}
            onDevolver={manejarDevolver}
          />
        )}
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