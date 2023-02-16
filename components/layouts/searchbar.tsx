import { FormControl, TextField } from "@mui/material";
import Searchicon from "@mui/icons-material/Search";
import { ChangeEventHandler } from "react";

type SearchBarProps = { handleSearch: ChangeEventHandler }

export default function SearchBar({ handleSearch }: SearchBarProps) {

    return (
        <FormControl>
            <TextField
                label='Busqueda por nombre'
                sx={{ width: 300, height: 30, marginBottom: 8, marginTop: 2, marginLeft: 0, marginRight: 0 }}
                InputProps={{
                    endAdornment: <Searchicon />
                }}
                onChange={handleSearch}
            />
        </FormControl>
    )
}