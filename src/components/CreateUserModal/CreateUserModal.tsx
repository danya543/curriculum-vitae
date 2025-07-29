import { useMutation, useQuery } from '@apollo/client';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    type SelectChangeEvent,
    TextField,
} from '@mui/material';
import type { Department, Position } from 'cv-graphql';
import { useMemo, useState } from 'react';

import { CREATE_USER } from '@/api/mutations/createUser';
import { GET_DEPARTMENTS } from '@/api/queries/getDepartments';
import { GET_POSITIONS } from '@/api/queries/getPosition';
import { useAlert } from '@/ui/Alert/useAlert';
import { Loader } from '@/ui/Loader/Loader';

import { MenuPropsSx, redInputSx } from '../constants';

type Props = {
    open: boolean;
    onClose: () => void;
    onCreated?: () => void;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\- ]+$/;

export const CreateUserModal = ({ open, onClose, onCreated }: Props) => {
    const { showAlert } = useAlert();

    const { data: depData, loading: depsLoading, error: depsError } = useQuery<{ departments: Department[] }>(GET_DEPARTMENTS);
    const { data: posData, loading: posLoading, error: posError } = useQuery<{ positions: Position[] }>(GET_POSITIONS);

    const [form, setForm] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        departmentId: '',
        positionId: '',
        role: 'Employee',
    });

    const [createUser, { loading: creating }] = useMutation(CREATE_USER, {
        onCompleted: async () => {
            await onCreated?.();
            showAlert({ type: 'success', message: 'User created successfully' });
            onClose();
        },
        onError: (err) => {
            showAlert({ type: 'error', message: err.message });
        },
    });

    const isValid = useMemo(() => {
        return (
            emailRegex.test(form.email.trim()) &&
            form.password.trim() !== '' &&
            nameRegex.test(form.first_name.trim()) &&
            nameRegex.test(form.last_name.trim()) &&
            form.departmentId.trim() !== '' &&
            form.positionId.trim() !== '' &&
            form.role.trim() !== ''
        );
    }, [form]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleDepartmentChange = (e: SelectChangeEvent) => {
        const selectedName = e.target.value;
        const selected = depData?.departments.find((d) => d.name === selectedName);
        setForm((prev) => ({ ...prev, departmentId: selected?.id ?? '' }));
    };

    const handlePositionChange = (e: SelectChangeEvent) => {
        const selectedName = e.target.value;
        const selected = posData?.positions.find((p) => p.name === selectedName);
        setForm((prev) => ({ ...prev, positionId: selected?.id ?? '' }));
    };

    const handleRoleChange = (e: SelectChangeEvent) => {
        setForm((prev) => ({ ...prev, role: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) {
            showAlert({ type: 'error', message: 'Please check input fields' });
            return;
        }

        await createUser({
            variables: {
                user: {
                    auth: {
                        email: form.email,
                        password: form.password,
                    },
                    profile: {
                        first_name: form.first_name,
                        last_name: form.last_name,
                    },
                    cvsIds: [],
                    departmentId: form.departmentId,
                    positionId: form.positionId,
                    role: form.role,
                },
            },
        });
    };

    const selectedDepName =
        depData?.departments.find((d) => d.id === form.departmentId)?.name ?? '';
    const selectedPosName =
        posData?.positions.find((p) => p.id === form.positionId)?.name ?? '';

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create User</DialogTitle>
            <DialogContent>
                {(depsLoading || posLoading) && <Loader />}
                {(depsError || posError) && <>error loading lists</>}

                {!depsLoading && !posLoading && !depsError && !posError && (
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
                    >
                        <TextField
                            label="Email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            error={!!form.email && !emailRegex.test(form.email)}
                            helperText={form.email && !emailRegex.test(form.email) ? 'Invalid email format' : ''}
                            sx={redInputSx}
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            sx={redInputSx}
                        />
                        <TextField
                            label="First Name"
                            name="first_name"
                            value={form.first_name}
                            onChange={handleChange}
                            required
                            error={!!form.first_name && !nameRegex.test(form.first_name)}
                            helperText={form.first_name && !nameRegex.test(form.first_name) ? 'Invalid characters' : ''}
                            sx={redInputSx}
                        />
                        <TextField
                            label="Last Name"
                            name="last_name"
                            value={form.last_name}
                            onChange={handleChange}
                            required
                            error={!!form.last_name && !nameRegex.test(form.last_name)}
                            helperText={form.last_name && !nameRegex.test(form.last_name) ? 'Invalid characters' : ''}
                            sx={redInputSx}
                        />

                        <FormControl fullWidth required sx={redInputSx}>
                            <InputLabel>Department</InputLabel>
                            <Select
                                value={selectedDepName}
                                label="Department"
                                onChange={handleDepartmentChange}
                                MenuProps={MenuPropsSx}
                            >
                                {depData?.departments.map((dep) => (
                                    <MenuItem key={dep.id} value={dep.name}>
                                        {dep.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth required sx={redInputSx}>
                            <InputLabel>Position</InputLabel>
                            <Select
                                value={selectedPosName}
                                label="Position"
                                onChange={handlePositionChange}
                                MenuProps={MenuPropsSx}
                            >
                                {posData?.positions.map((pos) => (
                                    <MenuItem key={pos.id} value={pos.name}>
                                        {pos.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth required sx={redInputSx}>
                            <InputLabel>Role</InputLabel>
                            <Select value={form.role} label="Role" onChange={handleRoleChange} MenuProps={MenuPropsSx}>
                                <MenuItem value="Employee">Employee</MenuItem>
                                <MenuItem value="Admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    sx={{ color: '#C63031', ':hover': { backgroundColor: 'rgba(198, 48, 49, 0.3)' } }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={creating || !isValid || depsLoading || posLoading}
                    sx={{ backgroundColor: '#C63031', ':hover': { backgroundColor: '#AA282A' } }}
                >
                    {creating ? 'Creating…' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
