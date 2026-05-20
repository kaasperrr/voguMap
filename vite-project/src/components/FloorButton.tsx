type FloorButtonProps = {
    buildingId: number
    onChangeFloor: (floor: number) => void
}

const svgPaths = Object.keys(import.meta.glob('../assets/building/*/floor*.svg'))

const buildingMaxFloors: Record<number, number> = {}

svgPaths.forEach(path => {
    const match = path.match(/building(\d+)\/floor(\d+)\.svg/)
    if (match) {
        const bId = Number(match[1])
        const floor = Number(match[2])
        if (!buildingMaxFloors[bId] || floor > buildingMaxFloors[bId]) {
            buildingMaxFloors[bId] = floor
        }
    }
})

export default function FloorButton({ buildingId, onChangeFloor }: FloorButtonProps) {
    const maxFloors = buildingMaxFloors[buildingId] || 1

    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
            {Array.from({ length: maxFloors }, (_, i) => i + 1).map(floor => (
                <button
                    key={floor}
                    className="floor-btn"
                    onClick={() => onChangeFloor(floor)}
                >
                    {floor}
                </button>
            ))}
        </div>
    )
}

export { buildingMaxFloors };