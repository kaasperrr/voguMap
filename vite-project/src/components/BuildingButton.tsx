
import { useBuildingList } from "../hooks/useBuildingList"

type BuildingButtonProps = {
    onChangeBuilding: (id: number) => void
    selectedBuildingId?: number
}

export default function BuildingButton({ onChangeBuilding, selectedBuildingId }: BuildingButtonProps) {
    const { buildings, isLoading, error } = useBuildingList()

    if (isLoading || error || !buildings.length) return null

    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            {buildings.map(building => (
                <button
                    className={`building-btn ${selectedBuildingId === building.id ? 'active' : ''}`}
                    key={building.id}
                    onClick={() => onChangeBuilding(building.id)}
                >
                    {building.name}
                </button>
            ))}
        </div>
    )
}