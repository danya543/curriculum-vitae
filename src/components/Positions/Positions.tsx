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

import { redInputSx } from "../constants";

export const Positions = ({ position, onChange, disabled }: PositionsProps) => {
    const { data, loading, error } = useQuery<PositionsData>(GET_POSITIONS);

    if (loading) return <>loading...</>;
    if (error) return <>error loading positions</>;

    const handleChange = (event: SelectChangeEvent) => {
        if (data) {
            onChange(data.positions.filter(pos => pos.name === event.target.value)[0].id);
        }
    };

    return (
        <FormControl fullWidth sx={redInputSx}>
            <InputLabel>Position</InputLabel>
            <Select value={data?.positions.find(pos => position === pos.id)?.name} label="Position" onChange={handleChange} disabled={disabled} MenuProps={{
                PaperProps: {
                    sx: {
                        '& .MuiMenuItem-root.Mui-selected': {
                            backgroundColor: 'rgba(198, 48, 49, 0.1)',
                            color: 'rgb(198, 48, 49)',
                            '&:hover': {
                                backgroundColor: 'rgba(198, 48, 49, 0.2)',
                            },
                        },
                    },
                },
            }}>
                {data?.positions.map(pos => (
                    <MenuItem key={pos.id} value={pos.name}>
                        {pos.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
