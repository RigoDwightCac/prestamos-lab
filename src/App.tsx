import "./App.css";
import { equiposPrueba } from "./data/equiposPrueba";
import { TITULO_APP } from "./config";
import Encabezado from "./components/Encabezado";
import ListaEquipos from "./components/ListaEquipos";

export default function App() {
  const equipos = equiposPrueba;

  const manejarPrestar = (id: number) => {
    console.log("Prestar equipo", id);
  };

  return (
    <>
      <Encabezado titulo={TITULO_APP} equipos={equipos} />
      <main className="contenedor">
        <ListaEquipos equipos={equipos} onPrestar={manejarPrestar} />
      </main>
    </>
  );
}