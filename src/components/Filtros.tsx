interface FiltrosProps {
  categorias: string[];
  categoria: string;
  busqueda: string;
  onCategoria: (valor: string) => void;
  onBusqueda: (valor: string) => void;
}

export default function Filtros({
  categorias,
  categoria,
  busqueda,
  onCategoria,
  onBusqueda,
}: FiltrosProps) {
  return (
    <div className="filtros">
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChange={(ev) => onBusqueda(ev.target.value)}
      />
      <select value={categoria} onChange={(ev) => onCategoria(ev.target.value)}>
        <option value="">Todas las categorías</option>
        {categorias.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}