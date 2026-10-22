import { feature } from 'topojson-client';
import { geoContains } from 'd3-geo';
import type { Topology, GeometryCollection } from 'topojson-specification';
import landTopo from 'world-atlas/land-110m.json';

// Landmassen der Erde (Natural Earth, 1:110 Mio.)
const topo = landTopo as unknown as Topology<{ land: GeometryCollection }>;
export const LAND = feature(topo, topo.objects.land);

export const isOverLand = (lon: number, lat: number) => geoContains(LAND, [lon, lat]);
