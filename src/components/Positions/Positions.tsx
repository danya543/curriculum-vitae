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
import { Loader } from "@/ui/Loader/Loader";

import { MenuPropsSx, redInputSx } from "../constants";

export const Positions = ({ position, onChange, disabled }: PositionsProps) => {
    const { data, loading, error } = useQuery<PositionsData>(GET_POSITIONS);

    if (loading) return <Loader />;
    if (error) return <>error loading positions</>;

    const handleChange = (event: SelectChangeEvent) => {
        if (data) {
            onChange(data.positions.filter(pos => pos.name === event.target.value)[0].id);
        }
    };

    return (
        <FormControl fullWidth sx={redInputSx}>
            <InputLabel>Position</InputLabel>
            <Select
                value={data?.positions.find(pos => position === pos.id)?.name}
                label="Position"
                onChange={handleChange}
                disabled={disabled}
                MenuProps={MenuPropsSx}>
                {data?.positions.map(pos => (
                    <MenuItem key={pos.id} value={pos.name}>
                        {pos.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
