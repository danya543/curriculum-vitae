import { useQuery } from "@apollo/client";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    type SelectChangeEvent,
} from "@mui/material";

import { GET_DEPARTMENTS } from "@/api/queries/getDepartments";
import type { DepartmentsData, DepartmentsProps } from "@/types/types";

export const Departments = ({ department, onChange, disabled }: DepartmentsProps) => {
    const { data, loading, error } = useQuery<DepartmentsData>(GET_DEPARTMENTS);

    if (loading) return <>loading...</>;
    if (error) return <>error loading departments</>;

    const handleChange = (event: SelectChangeEvent) => {
        if (data) {
            onChange(data.departments.filter(dep => dep.name === event.target.value)[0].id);
        }
    };

    return (
        <FormControl fullWidth
            sx={{
                '& .MuiInputLabel-root.Mui-focused': {
                    color: 'rgb(198, 48, 49)',
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgb(198, 48, 49)',
                },
            }
            }>
            <InputLabel>Department</InputLabel>
            <Select
                value={data?.departments.find(dep => department === dep.id)?.name}
                label="Department"
                onChange={handleChange}
                disabled={disabled}>
                {data?.departments.map(dep => (
                    <MenuItem key={dep.id} value={dep.name}>
                        {dep.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
