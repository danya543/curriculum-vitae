import { useQuery } from "@apollo/client";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    type SelectChangeEvent,
} from "@mui/material";

import { GET_POSITIONS } from "@/api/queries/getPosition";
import type { PositionsData } from "@/api/types";
import type { PositionsProps } from "@/types/types";

export const Positions = ({ position, onChange }: PositionsProps) => {
    const { data, loading, error } = useQuery<PositionsData>(GET_POSITIONS);

    if (loading) return <>loading...</>;
    if (error) return <>error loading positions</>;

    const handleChange = (event: SelectChangeEvent) => {
        onChange(event.target.value);
    };

    return (
        <FormControl fullWidth>
            <InputLabel>Position</InputLabel>
            <Select value={position} label="Position" onChange={handleChange}>
                {data?.positions.map(pos => (
                    <MenuItem key={pos.id} value={pos.name}>
                        {pos.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
