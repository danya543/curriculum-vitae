import { Box } from '@mui/material';

import { useAuth } from '@/hooks/useAuth';
import { useAvatar } from '@/hooks/useAvatar';
import { useProfileEdit } from '@/hooks/useProfileEdit';

import { AvatarBlock } from './Avatar';
import { ProfileForm } from './ProfileForm';
import { ProfileMeta } from './ProfileMeta';

type UserType = {
    id: string;
    profile: {
        first_name: string;
        last_name: string;
        full_name: string;
        avatar?: string;
    };
    email: string;
    created_at: string;
    department?: { id: string; name: string } | null;
    position?: { id: string; name: string } | null;
};

type ProfileProps = { user: UserType };

export const Profile: React.FC<ProfileProps> = ({ user }) => {
    const { id } = useAuth();
    const canEdit = user.id === id;

    const {
        form,
        isChanged,
        handleChange,
        handleDepartmentChange,
        handlePositionChange,
        handleSave,
    } = useProfileEdit(user);

    const { avatar, handleAvatarUpload, handleDeleteAvatar } = useAvatar(
        user.id,
        user.profile.avatar
    );

    const email = user.email || '';
    const joinedAt = user.created_at
        ? new Date(+user.created_at).toLocaleDateString()
        : '';

    return (
        <Box
            sx={{
                mt: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <AvatarBlock
                canEdit={canEdit}
                avatar={avatar}
                onDelete={handleDeleteAvatar}
                onUpload={handleAvatarUpload}
            />

            <ProfileMeta
                fullName={user.profile.full_name}
                email={email}
                joinedAt={joinedAt}
            />

            <ProfileForm
                canEdit={canEdit}
                form={form}
                onChange={handleChange}
                onDepartmentChange={handleDepartmentChange}
                onPositionChange={handlePositionChange}
                onSave={handleSave}
                isChanged={isChanged}
            />
        </Box>
    );
};
