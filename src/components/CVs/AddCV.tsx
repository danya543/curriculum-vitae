import { useMutation } from '@apollo/client';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Stack, TextField
} from '@mui/material';
import { useState } from 'react';

import { CREATE_CV } from '@/api/mutations/createCV';
import { useAuth } from '@/hooks/useAuth';
import type { Cv } from '@/types/types';
import { useAlert } from '@/ui/Alert/useAlert';

export const AddCV = ({ onCreateSuccess }: { onCreateSuccess: (cv: Cv) => void; }) => {
    const { id } = useAuth();
    const { showAlert } = useAlert();
    const [open, setOpen] = useState(false);

    const [form, setForm] = useState({
        name: '',
        education: '',
        description: ''
    });

    const [createCv] = useMutation(CREATE_CV);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setForm({ name: '', education: '', description: '' });
        setOpen(false);
    };

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!form.name || !form.description) {
            showAlert({ type: 'error', message: 'Name and description are required' });
            return;
        }

        const input = {
            name: form.name,
            description: form.description,
            education: form.education,
            id,
        };

        try {
            const { data } = await createCv({ variables: { input } });
            showAlert({ type: 'success', message: 'CV created successfully' });
            onCreateSuccess(data.createCv);
            handleClose();
        } catch {
            showAlert({ type: 'error', message: 'Failed to create CV' });
        }
    };

    const isDisabled = !form.name || !form.description;

    return (
        <>
            <Button variant="contained" onClick={handleOpen}>Add new CV</Button>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Create New CV</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Name"
                            required
                            value={form.name}
                            onChange={e => handleChange('name', e.target.value)}
                        />
                        <TextField
                            label="Education"
                            value={form.education}
                            onChange={e => handleChange('education', e.target.value)}
                        />
                        <TextField
                            label="Description"
                            required
                            multiline
                            rows={3}
                            value={form.description}
                            onChange={e => handleChange('description', e.target.value)}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={isDisabled}>Create</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
