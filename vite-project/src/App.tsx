import { useState } from 'react'
import './App.css'
import FloorPlan from './components/FloorPlan'
import BuildingButton from './components/BuildingButton'
import FloorButton from './components/FloorButton'
import HeaderInfo from './components/HeaderInfo'
import { useBuildingList } from './hooks/useBuildingList'

function formatAddress(address: string): string {
    let result = address.replace(/^ул\.\s*/, '');
    const commaIndex = result.indexOf(', г. ');
    if (commaIndex !== -1) {
        result = result.substring(0, commaIndex);
    }
    return result;
}

function App() {
    const [building, setBuilding] = useState(1)
    const [floor, setFloor] = useState(1)

    const { buildings } = useBuildingList()
    const currentBuilding = buildings.find(b => b.id === building)
    const buildingAddress = currentBuilding?.address ?? `Корпус ${building}`

    return (
        <div className="app-layout">
            <HeaderInfo buildingName={formatAddress(buildingAddress)} floor={floor} />

            <div className="controls" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <BuildingButton onChangeBuilding={setBuilding} />
                <FloorButton buildingId={building} onChangeFloor={setFloor} />
            </div>
            <FloorPlan buildingId={building} floor={floor} />
        </div>
    )
}

export default App