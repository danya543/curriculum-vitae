import {
    Avatar,
    Box,
    Button,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";

import { useUpdateProfile } from "@/api/mutations/updProfile";
import { getId } from "@/components/constants";
import { Departments } from "@/components/Departments/Departments";
import { Positions } from "@/components/Positions/Positions";

type CVProps = {
    created_at: string;
    id: string;
}

type UserType = {
    id: string;
    cvs: CVProps[]
    profile: {
        first_name: string;
        last_name: string;
        email?: string;
        avatar_url?: string;
    };
    email?: string;
    created_at?: string;
    department_name?: string;
    position_name?: string;
    is_verified: boolean;
};

type ProfileProps = {
    user: UserType;
};

export const Profile = ({ user }: ProfileProps) => {
    const initialState = {
        firstName: user.profile.first_name,
        lastName: user.profile.last_name,
        department: user.department_name || "",
        position: user.position_name || "",
    };
    const id = getId();

    const [form, setForm] = useState(initialState);

    const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
    };

    const { updateProfile } = useUpdateProfile();

    const handleSave = async () => {
        try {
            await updateProfile({
                userId: +user.id,
                first_name: form.firstName,
                last_name: form.lastName,
            });
        } catch (err) {
            console.error(err)
        }
    };

    const handleDepartmentChange = (value: string) => {
        setForm(prev => ({ ...prev, department: value }));
    };

    const handlePositionChange = (value: string) => {
        setForm(prev => ({ ...prev, position: value }));
    };

    const isChanged = JSON.stringify(form) !== JSON.stringify(initialState);

    const email = user.email || user.profile.email || "";
    const joinedAt = user.created_at ? new Date(+user.created_at).toLocaleDateString() : "";
    const avatarUrl = user.profile.avatar_url || "/avatar.png";

    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Avatar src={avatarUrl} sx={{ width: 80, height: 80 }} />
                {user.id === id && <Button variant="outlined" component="label">
                    Upload Avatar
                    <input type="file" hidden accept="image/*" />
                </Button>}
            </Box>

            <Typography variant="subtitle1">Name: {initialState.firstName} {initialState.lastName}</Typography>
            <Typography variant="subtitle1">Email: {email}</Typography>
            <Typography variant="subtitle1">Joined: {joinedAt}</Typography>

            {id === user.id && <Box component="form" sx={{ mt: 4 }} noValidate autoComplete="off" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <TextField
                            fullWidth
                            label="First Name"
                            value={form.firstName}
                            onChange={handleChange("firstName")}
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            value={form.lastName}
                            onChange={handleChange("lastName")}
                        />
                    </Grid>
                    <Grid size={6}>
                        <Departments department={form.department} onChange={handleDepartmentChange} />
                    </Grid>
                    <Grid size={6}>
                        <Positions position={form.position} onChange={handlePositionChange} />
                    </Grid>
                    {id === user.id && <Grid size={6}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!isChanged}
                        >
                            Save Changes
                        </Button>
                    </Grid>}
                </Grid>
            </Box>}
        </Box>
    );
};
