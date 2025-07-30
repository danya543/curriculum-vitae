import { useMutation } from '@apollo/client';
import { useMemo, useState } from 'react';

import { client } from '@/api/client';
import { UPDATE_PROFILE } from '@/api/mutations/updProfile';
import { UPDATE_USER } from '@/api/mutations/updUser';
import { GET_USER } from '@/api/queries/getUser';
import { useAlert } from '@/ui/Alert/useAlert';

type UserForEdit = {
    id: string;
    profile: { first_name: string; last_name: string };
    department?: { id: string } | null;
    position?: { id: string } | null;
};

export const useProfileEdit = (user: UserForEdit) => {
    const [updateUserMutation] = useMutation(UPDATE_USER);
    const [updateProfile] = useMutation(UPDATE_PROFILE);
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
            form.firstName.trim() !== initialState.firstName ||
            form.lastName.trim() !== initialState.lastName;

        const deptPosChanged =
            form.department !== initialState.department ||
            form.position !== initialState.position;

        try {
            if (nameChanged && deptPosChanged) {
                await Promise.all([
                    updateProfile({
                        variables: {
                            profile: {
                                userId: +user.id,
                                first_name: form.firstName.trim() || '',
                                last_name: form.lastName.trim() || '',
                            }
                        },
                        update: (cache) => {
                            cache.modify({
                                id: cache.identify({ __typename: 'User', id: user.id }),
                                fields: {
                                    profile(existingProfile = {}) {
                                        const updatedFirst = form.firstName.trim();
                                        const updatedLast = form.lastName.trim();
                                        return {
                                            ...existingProfile,
                                            first_name: updatedFirst,
                                            last_name: updatedLast,
                                            full_name: `${updatedFirst} ${updatedLast}`,
                                        };
                                    },
                                },
                            });
                        },
                    }),
                    updateUserMutation({
                        variables: {
                            user: {
                                userId: +user.id,
                                departmentId: form.department || '',
                                positionId: form.position || '',
                            },
                        },
                        refetchQueries: [{ query: GET_USER, variables: { userId: user.id } }],
                    }),
                ]);
            } else if (nameChanged) {
                await updateProfile({
                    variables: {
                        profile: {
                            userId: +user.id,
                            first_name: form.firstName.trim() || '',
                            last_name: form.lastName.trim() || '',
                        }
                    },
                    update: (cache) => {
                        cache.modify({
                            id: cache.identify({ __typename: 'User', id: user.id }),
                            fields: {
                                profile(existingProfile = {}) {
                                    const updatedFirst = form.firstName.trim();
                                    const updatedLast = form.lastName.trim();
                                    return {
                                        ...existingProfile,
                                        first_name: updatedFirst,
                                        last_name: updatedLast,
                                        full_name: `${updatedFirst} ${updatedLast}`,
                                    };
                                },
                            },
                        });
                    },
                });
                await client.refetchQueries({
                    include: [GET_USER],
                });
            } else if (deptPosChanged) {
                await updateUserMutation({
                    variables: {
                        user: {
                            userId: +user.id,
                            departmentId: form.department || '',
                            positionId: form.position || '',
                        },
                    },
                    refetchQueries: [{ query: GET_USER, variables: { userId: user.id } }],
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
