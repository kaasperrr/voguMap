const svgRawModules = import.meta.glob<string>(
  '../assets/building/*/floor*.svg',
  { eager: true, query: '?raw', import: 'default' }
);

function getSvgText(buildingId: number, floor: number): string | null {
  const filePath = `../assets/building/building${buildingId}/floor${floor}.svg`;
  const module = svgRawModules[filePath];
  if (typeof module === 'string') return module;
  if (module && typeof module === 'object' && 'default' in module) {
    return (module as any).default;
  }
  return null;
}

const floorCache = new Map<string, number>();

export async function findFloorByRoomId(
  buildingId: number,
  roomId: number,
  maxFloor: number
): Promise<number | null> {
  const cacheKey = `${buildingId}:${roomId}`;
  if (floorCache.has(cacheKey)) {
    console.log(`[findFloor] из кеша: комната ${roomId} на этаже ${floorCache.get(cacheKey)}`);
    return floorCache.get(cacheKey)!;
  }

  console.log(`[findFloor] ищем комнату ${roomId} в корпусе ${buildingId}, этажи 1-${maxFloor}`);

  for (let floor = 1; floor <= maxFloor; floor++) {
    const svgText = getSvgText(buildingId, floor);
    if (!svgText) {
      console.log(`[findFloor] этаж ${floor}: SVG не найден`);
      continue;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    const element = doc.getElementById(String(roomId));
    const allIds = Array.from(doc.querySelectorAll('[id]')).slice(0, 10).map(el => el.id);
    console.log(`[findFloor] этаж ${floor}: найдены id: ${allIds.join(', ')}${allIds.length >= 10 ? '...' : ''}`);

    if (element) {
      console.log(`[findFloor] комната ${roomId} найдена на этаже ${floor}`);
      floorCache.set(cacheKey, floor);
      return floor;
    }
  }

  console.warn(`[findFloor] комната ${roomId} не найдена ни на одном этаже`);
  return null;
}