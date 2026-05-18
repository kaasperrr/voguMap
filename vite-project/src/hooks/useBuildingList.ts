import { useEffect, useState } from "react";
import type { Building } from "../types/Building";

export function useBuildingList() {
    const [buildings, setBuildings] = useState<Building[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const getBuildings = async () => {
            try {
                const response = await fetch('https://voguschedule.ru/api/v1/buildings')
                const data = await response.json()
                setBuildings(data.items)
            }
            catch (error) {
                setError(error instanceof Error ? error.message : "Ошибка загрузки корпусов")
            }
            finally {
                setIsLoading(false)
            }
        }
        getBuildings()
    }, [])

    return { buildings, isLoading, error }
}