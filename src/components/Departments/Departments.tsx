import { useQuery } from "@apollo/client";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    type SelectChangeEvent,
} from "@mui/material";

import { GET_DEPARTMENTS } from "@/api/queries/getDepartments";

interface Department {
    id: string;
    name: string;
    created_at: string;
}

interface DepartmentsData {
    departments: Department[];
}

interface DepartmentsProps {
    department: string;
    onChange: (value: string) => void;
}

export const Departments = ({ department, onChange }: DepartmentsProps) => {
    const { data, loading, error } = useQuery<DepartmentsData>(GET_DEPARTMENTS);

    if (loading) return <>loading...</>;
    if (error) return <>error loading departments</>;

    const handleChange = (event: SelectChangeEvent) => {
        onChange(event.target.value);
    };

    return (
        <FormControl fullWidth>
            <InputLabel>Department</InputLabel>
            <Select value={department} label="Department" onChange={handleChange}>
                {data?.departments.map(dep => (
                    <MenuItem key={dep.id} value={dep.name}>
                        {dep.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
