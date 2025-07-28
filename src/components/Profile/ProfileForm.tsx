import { Box, Button, Grid, TextField } from '@mui/material';

import { Departments } from '@/components/Departments/Departments';
import { Positions } from '@/components/Positions/Positions';

import { redInputSx } from '../constants';

type Props = {
    canEdit: boolean;
    form: {
        firstName: string;
        lastName: string;
        department: string;
        position: string;
    };
    onChange: (field: 'firstName' | 'lastName') => (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDepartmentChange: (value: string) => void;
    onPositionChange: (value: string) => void;
    onSave: () => void;
    isChanged: boolean;
};

export const ProfileForm: React.FC<Props> = ({
    canEdit,
    form,
    onChange,
    onDepartmentChange,
    onPositionChange,
    onSave,
    isChanged,
}) => {
    return (
        <Box
            component="form"
            sx={{ mt: 4 }}
            noValidate
            autoComplete="off"
            onSubmit={e => {
                e.preventDefault();
                onSave();
            }}
        >
            <Grid container spacing={2}>
                <Grid size={6}>
                    <TextField
                        fullWidth
                        label="First Name"
                        value={form.firstName}
                        onChange={onChange('firstName')}
                        disabled={!canEdit}
                        sx={redInputSx}
                    />
                </Grid>
                <Grid size={6}>
                    <TextField
                        fullWidth
                        label="Last Name"
                        value={form.lastName}
                        onChange={onChange('lastName')}
                        disabled={!canEdit}
                        sx={redInputSx}
                    />
                </Grid>

                <Grid size={6}>
                    <Departments
                        department={form.department}
                        onChange={onDepartmentChange}
                        disabled={!canEdit}
                    />
                </Grid>
                <Grid size={6}>
                    <Positions
                        position={form.position}
                        onChange={onPositionChange}
                        disabled={!canEdit}
                    />
                </Grid>

                {canEdit && (
                    <Grid size={6}>
                        <Button
                            type="submit"
                            variant="text"
                            sx={{ color: 'rgb(198, 48, 49)' }}
                            disabled={!isChanged}
                        >
                            Save Changes
                        </Button>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};
