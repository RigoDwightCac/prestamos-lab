import type { Equipo } from "../types";

export const equiposPrueba: Equipo[] = [
  { id: 1, nombre: "Switch Cisco Catalyst 2960", categoria: "Switch", disponible: true },
  { id: 2, nombre: "Switch TP-Link 24 puertos", categoria: "Switch", disponible: false },
  { id: 3, nombre: "Switch D-Link 8 puertos", categoria: "Switch", disponible: true },
  { id: 4, nombre: "Cable UTP Cat6 de 3 m", categoria: "Cable de red", disponible: true },
  { id: 5, nombre: "Cable UTP Cat5e de 5 m", categoria: "Cable de red", disponible: true },
  { id: 6, nombre: "Cable de consola Cisco", categoria: "Cable de red", disponible: false },
  { id: 7, nombre: "Access Point Ubiquiti UniFi", categoria: "Access Point", disponible: true },
  { id: 8, nombre: "Access Point TP-Link EAP225", categoria: "Access Point", disponible: false },
  { id: 9, nombre: "Access Point Cisco Aironet", categoria: "Access Point", disponible: true },
];