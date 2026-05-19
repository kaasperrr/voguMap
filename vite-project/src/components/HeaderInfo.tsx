type HeaderInfoProps = {
    buildingName: string
    floor: number
}

export default function HeaderInfo({ buildingName, floor }: HeaderInfoProps) {
    return (
        <div className="center-header">
            <div className="building-name">{buildingName}</div>
            <div className="floor-name">{floor} ЭТАЖ</div>
        </div>
    )
}