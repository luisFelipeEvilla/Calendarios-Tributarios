import { createContext, useState } from "react";

export const FiltersContext = createContext<
    {
        year: number,
        setYear: Function,
        search: string | null,
        setSearch: Function
    }
>({
    year: new Date().getFullYear(),
    setYear: () => { },
    search: null,
    setSearch: () => { },
});

export function FiltersProvider({ children }: any) {
    // const [year, setYear] = useState<number>(new Date().getFullYear());
    const [year, setYear] = useState<number>(2024);
    const [search, setSearch] = useState<string | null>('');

    return (
        <FiltersContext.Provider value={{ year, setYear, search, setSearch }}>
            {children}
        </FiltersContext.Provider>
    );
}