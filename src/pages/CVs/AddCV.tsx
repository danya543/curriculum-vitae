import { useMutation } from '@apollo/client';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Stack, TextField
} from '@mui/material';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { CREATE_CV } from '@/api/mutations/createCV';
import { GET_CVS } from '@/api/queries/getCVs';
import { redInputSx } from '@/components/constants';
import { useAuth } from '@/hooks/useAuth';
import type { CvsData } from '@/types/types';
import { useAlert } from '@/ui/Alert/useAlert';

export const AddCV = () => {
    const { id } = useAuth();
    const { showAlert } = useAlert();
    const [open, setOpen] = useState(false);

    const [form, setForm] = useState({
        name: '',
        education: '',
        description: ''
    });

    const [createCv] = useMutation(CREATE_CV, {
        update(cache, { data }) {
            const newCv = data?.createCv;
            if (!newCv) return;

            cache.updateQuery<CvsData>({
                query: GET_CVS,
                variables: { id },
            }, (existing) => {
                if (!existing) return { cvs: [newCv] };
                return {
                    cvs: [newCv, ...existing.cvs],
                };
            });
        }
    });

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
            name: form.name.trim(),
            description: form.description.trim(),
            education: form.education.trim(),
            userId: id,
        };

        try {
            await createCv({ variables: { input } });
            showAlert({ type: 'success', message: 'CV created successfully' });
            handleClose();
        } catch {
            showAlert({ type: 'error', message: 'Failed to create CV' });
        }
    };

    const isDisabled = !form.name || !form.description;

    return (
        <>
            <Button sx={{ color: '#c63031', display: 'flex', alignItems: 'center' }}
                onClick={handleOpen}>
                <Plus style={{ width: 20, height: 20 }} />
                Create CV
            </Button>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Create New CV</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Name"
                            required
                            sx={redInputSx}
                            value={form.name}
                            onChange={e => handleChange('name', e.target.value)}
                        />
                        <TextField
                            label="Education"
                            value={form.education}
                            sx={redInputSx}
                            onChange={e => handleChange('education', e.target.value)}
                        />
                        <TextField
                            label="Description"
                            required
                            multiline
                            sx={redInputSx}
                            rows={3}
                            value={form.description}
                            onChange={e => handleChange('description', e.target.value)}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button sx={{ color: '#c63031' }} onClick={handleClose}>Cancel</Button>
                    <Button sx={{ background: '#c63031', '&:hover': { background: 'action.hover' } }} onClick={handleSubmit} variant="contained" disabled={isDisabled}>Create</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
