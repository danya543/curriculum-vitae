import { useMutation } from '@apollo/client';
import { useMemo, useState } from 'react';

import { useUpdateProfile } from '@/api/mutations/updProfile';
import { UPDATE_USER } from '@/api/mutations/updUser';
import { useAlert } from '@/ui/Alert/useAlert';

type UserForEdit = {
    id: string;
    profile: { first_name: string; last_name: string };
    department?: { id: string } | null;
    position?: { id: string } | null;
};

export const useProfileEdit = (user: UserForEdit) => {
    const [updateUserMutation] = useMutation(UPDATE_USER);
    const { updateProfile } = useUpdateProfile();
    const { showAlert } = useAlert();

    const [initialState, setInitialState] = useState({
        firstName: user.profile.first_name,
        lastName: user.profile.last_name,
        department: user.department?.id || '',
        position: user.position?.id || '',
    });

    const [form, setForm] = useState(initialState);

    const isChanged = useMemo(
        () => JSON.stringify(form) !== JSON.stringify(initialState),
        [form, initialState]
    );

    const handleChange =
        (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setForm(prev => ({ ...prev, [field]: e.target.value }));
        };

    const handleDepartmentChange = (value: string) => {
        setForm(prev => ({ ...prev, department: value }));
    };

    const handlePositionChange = (value: string) => {
        setForm(prev => ({ ...prev, position: value }));
    };

    const handleSave = async () => {
        const nameChanged =
            form.firstName !== initialState.firstName ||
            form.lastName !== initialState.lastName;

        const deptPosChanged =
            form.department !== initialState.department ||
            form.position !== initialState.position;

        try {
            if (nameChanged && deptPosChanged) {
                await Promise.all([
                    updateProfile({
                        userId: +user.id,
                        first_name: form.firstName || '',
                        last_name: form.lastName || '',
                    }),
                    updateUserMutation({
                        variables: {
                            user: {
                                userId: +user.id, // важное исправление: userId, а не id
                                departmentId: form.department || null,
                                positionId: form.position || null,
                            },
                        },
                    }),
                ]);
            } else if (nameChanged) {
                await updateProfile({
                    userId: +user.id,
                    first_name: form.firstName || '',
                    last_name: form.lastName || '',
                });
            } else if (deptPosChanged) {
                await updateUserMutation({
                    variables: {
                        user: {
                            userId: +user.id,
                            departmentId: form.department || null,
                            positionId: form.position || null,
                        },
                    },
                });
            } else {
                return;
            }

            setInitialState(form);
            showAlert({ type: 'success', message: 'Successfully updated' });
        } catch (err) {
            console.error(err);
            showAlert({ type: 'error', message: 'Failed to update' });
        }
    };

    return {
        form,
        initialState,
        isChanged,
        handleChange,
        handleDepartmentChange,
        handlePositionChange,
        handleSave,
        setInitialState,
        setForm,
    };
};
