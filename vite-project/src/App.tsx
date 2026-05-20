import { useState, useEffect, useRef } from 'react';
import './App.css';
import FloorPlan from './components/FloorPlan';
import BuildingButton from './components/BuildingButton';
import FloorButton, { buildingMaxFloors } from './components/FloorButton';
import HeaderInfo from './components/HeaderInfo';
import { useBuildingList } from './hooks/useBuildingList';
import { useRoomSearch } from './hooks/useRoomSearch';
import { findFloorByRoomId } from './utils/findRoomFloor';

function formatAddress(address: string): string {
  let result = address.replace(/^ул\.\s*/, '');
  const commaIndex = result.indexOf(', г. ');
  if (commaIndex !== -1) result = result.substring(0, commaIndex);
  return result;
}

function App() {
  const [building, setBuilding] = useState(1);
  const [floor, setFloor] = useState(1);
  const [highlightRoomId, setHighlightRoomId] = useState<string | undefined>(undefined);
  const { buildings } = useBuildingList();
  const { searchRoom } = useRoomSearch();

  const urlProcessedRef = useRef(false);
  const lastParamsRef = useRef('');

  const currentBuilding = buildings.find(b => b.id === building);
  const buildingAddress = currentBuilding?.address ?? `Корпус ${building}`;

  useEffect(() => {
    if (urlProcessedRef.current) return;
    urlProcessedRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const buildingIdParam = params.get('building_id');
    const roomNameParam = params.get('room_name');
    const paramsKey = `${buildingIdParam}|${roomNameParam}`;
    if (lastParamsRef.current === paramsKey) return;
    lastParamsRef.current = paramsKey;

    if (!buildingIdParam || !roomNameParam) return;

    const buildingId = parseInt(buildingIdParam, 10);
    if (isNaN(buildingId)) return;

    searchRoom(buildingId, roomNameParam).then(async (rooms) => {
      console.log('Ответ API:', rooms);
      if (rooms.length === 0) return;

      let selectedRoom = rooms[0];
      if (rooms.length > 1) {
        const roomNames = rooms.map(r => r.name).join(', ');
        const userChoice = window.confirm(`Найдено несколько: ${roomNames}\nВыбрать первый?`);
        if (!userChoice) return;
      }

      console.log(`Выбрана комната id=${selectedRoom.id}, имя=${selectedRoom.name}`);
      const maxFloor = buildingMaxFloors[buildingId] || 1;
      const foundFloor = await findFloorByRoomId(buildingId, selectedRoom.id, maxFloor);

      if (foundFloor === null) {
        console.warn(`Не удалось определить этаж для комнаты ${selectedRoom.id}`);
        return;
      }

      console.log(`Переключаюсь на корпус ${buildingId}, этаж ${foundFloor}, подсветка комнаты ${selectedRoom.id}`);
      setBuilding(buildingId);
      setFloor(foundFloor);
      
      setTimeout(() => {
        setHighlightRoomId(String(selectedRoom.id));
      }, 100);
    }).catch(console.error);
  }, [searchRoom]);

  useEffect(() => {
    setHighlightRoomId(undefined);
  }, [building, floor]);

  return (
    <div className="app-layout">
      <HeaderInfo buildingName={formatAddress(buildingAddress)} floor={floor} />
      <div className="controls" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <BuildingButton onChangeBuilding={setBuilding} selectedBuildingId={building} />
        <FloorButton buildingId={building} onChangeFloor={setFloor} />
      </div>
      <FloorPlan
        buildingId={building}
        floor={floor}
        highlightRoomId={highlightRoomId}
        onHighlightCleared={() => setHighlightRoomId(undefined)}
      />
    </div>
  );
}

export default App;