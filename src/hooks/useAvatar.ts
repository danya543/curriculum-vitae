import { useMutation } from '@apollo/client';
import { useRef, useState } from 'react';

import { DELETE_AVATAR } from '@/api/mutations/deleteAvatar';
import { UPLOAD_AVATAR } from '@/api/mutations/uploadAvatar';
import { useAlert } from '@/ui/Alert/useAlert';

export const useAvatar = (userId: string, initialAvatar?: string) => {
    const [avatar, setAvatar] = useState(initialAvatar || '/avatar.png');
    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const { showAlert } = useAlert();

    const [deleteAvatarMutation] = useMutation(DELETE_AVATAR);
    const [uploadAvatarMutation] = useMutation(UPLOAD_AVATAR);

    const handleDeleteAvatar = async () => {
        try {
            await deleteAvatarMutation({
                variables: { avatar: { userId: +userId } },
            });
            setAvatar('/avatar.png');
            showAlert({ type: 'success', message: 'Avatar deleted successfully' });
        } catch (err) {
            console.error(err);
            showAlert({ type: 'error', message: 'Failed to delete avatar' });
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const result = reader.result as string;
            try {
                const { data } = await uploadAvatarMutation({
                    variables: {
                        avatar: {
                            userId,
                            base64: result,
                            size: file.size,
                            type: file.type,
                        },
                    },
                });

                if (data?.uploadAvatar) {
                    setAvatar(data.uploadAvatar);
                    showAlert({ type: 'success', message: 'Avatar uploaded successfully' });
                    if (inputFileRef.current) inputFileRef.current.value = '';
                }
            } catch (err) {
                console.error(err);
                showAlert({ type: 'error', message: 'Failed to upload avatar' });
            }
        };

        reader.readAsDataURL(file);
    };

    return { avatar, handleAvatarUpload, handleDeleteAvatar, inputFileRef };
};
