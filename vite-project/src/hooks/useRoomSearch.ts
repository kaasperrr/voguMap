import { useState, useCallback } from 'react';

export type RoomSearchResult = {
  id: number;
  name: string;
  academicBuilding: {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  type: {
    id: number;
    name: string;
    isScheduleable: boolean;
  };
};

export function useRoomSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchRoom = useCallback(async (buildingId: number, roomName: string): Promise<RoomSearchResult[]> => {
    setIsSearching(true);
    setSearchError(null);
    try {
      const url = `https://voguschedule.ru/api/v1/room/map?buildingId=${buildingId}&roomNumber=${encodeURIComponent(roomName)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Ошибка ${response.status}`);
      const data = await response.json();
      return data;
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      return [];
    } finally {
      setIsSearching(false);
    }
  }, []);

  return { searchRoom, isSearching, searchError };
}