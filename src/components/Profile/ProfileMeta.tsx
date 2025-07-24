import { Typography } from '@mui/material';

type Props = {
    fullName: string;
    email: string;
    joinedAt: string;
};

export const ProfileMeta: React.FC<Props> = ({ fullName, email, joinedAt }) => (
    <>
        <Typography variant="subtitle1">Name: {fullName}</Typography>
        <Typography variant="subtitle1">Email: {email}</Typography>
        <Typography variant="subtitle1">Joined: {joinedAt}</Typography>
    </>
);
