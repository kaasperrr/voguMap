import { type ComponentType, useEffect, useState, useRef } from "react";
import type { JSX } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type FloorPlanProps = {
  buildingId: number;
  floor: number;
  highlightRoomId?: string;
  onHighlightCleared?: () => void;
};

const svgArray = import.meta.glob<{ default: ComponentType }>(
  '../assets/building/*/floor*.svg',
  { eager: true, query: '?react' }
);

export default function FloorPlan({ buildingId, floor, highlightRoomId, onHighlightCleared }: FloorPlanProps): JSX.Element {
  const [SvgFloor, setSvgFloor] = useState<ComponentType | null>(null);
  const [selectCabinetId, setSelectCabinetId] = useState<string>('');
  const transformRef = useRef<any>(null);
  const prevHighlightRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    setSvgFloor(null);
    setSelectCabinetId('');
    const filePath = `../assets/building/building${buildingId}/floor${floor}.svg`;
    const svgModule = svgArray[filePath];
    if (svgModule) {
      setSvgFloor(() => svgModule.default);
    }
  }, [buildingId, floor]);

  useEffect(() => {
    if (!SvgFloor) return;
    if (highlightRoomId === undefined) return;
    if (prevHighlightRef.current === highlightRoomId) return;

    const timer = setTimeout(() => {
      const targetElement = document.getElementById(highlightRoomId);
      if (targetElement) {
        if (selectCabinetId) {
          const prevElem = document.getElementById(selectCabinetId);
          if (prevElem) prevElem.style.fill = "";
        }

        targetElement.style.transition = "fill 0.3s ease";
        targetElement.style.fill = "#ff0000";
        setSelectCabinetId(highlightRoomId);
        prevHighlightRef.current = highlightRoomId;

        if (transformRef.current) {
          const rect = targetElement.getBoundingClientRect();
          const containerRect = transformRef.current.wrapperComponent?.getBoundingClientRect();
          if (containerRect) {
            const offsetX = rect.left + rect.width / 2 - containerRect.left - containerRect.width / 2;
            const offsetY = rect.top + rect.height / 2 - containerRect.top - containerRect.height / 2;
            transformRef.current.setTransform(transformRef.current.state.scale, offsetX, offsetY, 300);
          }
        }
      } else {
        console.warn(`Элемент с id="${highlightRoomId}" не найден на текущем этаже.`);
        if (onHighlightCleared) onHighlightCleared();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [SvgFloor, highlightRoomId, selectCabinetId, onHighlightCleared]);

  const onCabinetClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (selectCabinetId) {
      const prevCabinet = document.getElementById(selectCabinetId);
      if (prevCabinet) prevCabinet.style.fill = "";
    }
    if (!target.id) {
      setSelectCabinetId('');
      if (onHighlightCleared) onHighlightCleared();
      return;
    }
    setSelectCabinetId(target.id);
    target.style.transition = "fill 0.3s ease";
    target.style.fill = "#ff0000";
    if (onHighlightCleared) onHighlightCleared();
  };

  if (!SvgFloor) {
    return <div>Пока пусто</div>;
  }

  return (
    <TransformWrapper
      ref={transformRef}
      key={`${buildingId}-${floor}`}
      minScale={0.5}
      maxScale={3}
      limitToBounds={false}
      wheel={{ step: 0.001 }}
    >
      <TransformComponent
        wrapperStyle={{
          width: '100%',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex'
        }}
      >
        <div onClick={onCabinetClick}>
          <SvgFloor />
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
}