import { type ComponentType, useEffect, useState, useRef } from "react"
import type { JSX } from "react"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"

type FloorPlanProps = {
    buildingId: number
    floor: number
}

const svgArray = import.meta.glob<{ default: ComponentType }>(
    '../assets/building/*/floor*.svg',
    { eager: true, query: '?react' }
)

export default function FloorPlan({ buildingId, floor }: FloorPlanProps): JSX.Element {
    const [SvgFloor, setSvgFloor] = useState<ComponentType | null>(null)
    const [selectCabinetId, setSelectCabinetId] = useState<string>('')
    const transformRef = useRef<any>(null)

    useEffect(() => {
        setSvgFloor(null)
        setSelectCabinetId('')

        const filePath = `../assets/building/building${buildingId}/floor${floor}.svg`
        const svgModule = svgArray[filePath]
        if (svgModule) {
            setSvgFloor(() => svgModule.default)
        }
    }, [buildingId, floor])

    useEffect(() => {
        if (SvgFloor && transformRef.current) {

            const raf = requestAnimationFrame(() => {
                transformRef.current?.centerView(0.5, 300)
            })
            return () => cancelAnimationFrame(raf)
        }
    }, [SvgFloor])

    const onCabinetClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement


        if (selectCabinetId) {
            const prevCabinet = document.getElementById(selectCabinetId)
            if (prevCabinet) prevCabinet.style.fill = ""
        }


        if (!target.id) {
            setSelectCabinetId('')
            return
        }


        setSelectCabinetId(target.id)
        target.style.transition = "fill 0.3s ease"
        target.style.fill = "#ff0000"
    }

    if (!SvgFloor) {
        return <div>Пока пусто</div>
    }

    return (
        <TransformWrapper
            ref={transformRef}
            key={`${buildingId}-${floor}`}
            minScale={0.2}
            maxScale={5}
            limitToBounds={true}

        >
            <TransformComponent 
                wrapperStyle={{ 
                    width: '100%', 
                    height: '80vh',

                }}
            >
                <div onClick={onCabinetClick}>
                    <SvgFloor />
                </div>
            </TransformComponent>
        </TransformWrapper>
    )
}