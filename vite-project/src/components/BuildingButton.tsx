
import { useBuildingList } from "../hooks/useBuildingList"

type BuildingButtonProps = {
    onChangeBuilding: (id: number) => void
    selectedBuildingId?: number
}

function formatAddress(address: string): string {
    let result = address.replace(/^ул\.\s*/, '');
    const commaIndex = result.indexOf(', г. ');
    if (commaIndex !== -1) {
        result = result.substring(0, commaIndex);
    }
    return result;
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
                    {formatAddress(building.address)}
                </button>
            ))}
        </div>
    )
}