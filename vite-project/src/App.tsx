import { useState } from 'react'
import './App.css'
import FloorPlan from './components/FloorPlan'
import BuildingButton from './components/BuildingButton'
import FloorButton from './components/FloorButton'

function App() {
    const [building, setBuilding] = useState(1)
    const [floor, setFloor] = useState(1)

    return (
        <div className="app-layout">
            <div className="controls" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <BuildingButton onChangeBuilding={setBuilding} />
                <FloorButton buildingId={building} onChangeFloor={setFloor} />
            </div>
            <FloorPlan buildingId={building} floor={floor} />
        </div>
    )
}

export default App