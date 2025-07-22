import { useMutation } from "@apollo/client";
import {
    Avatar,
    Box,
    Button,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import { X } from "lucide-react";
import { useState } from "react";

import { DELETE_AVATAR } from "@/api/mutations/deleteAvatar";
import { useUpdateProfile } from "@/api/mutations/updProfile";
import { UPLOAD_AVATAR } from "@/api/mutations/uploadAvatar";
import { getId } from "@/components/constants";
import { Departments } from "@/components/Departments/Departments";
import { Positions } from "@/components/Positions/Positions";
import { useAlert } from "@/ui/Alert/useAlert";

type UserType = {
    id: string;
    profile: {
        first_name: string;
        last_name: string;
        full_name: string
        avatar?: string;
    };
    email: string;
    created_at: string;
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
    const [deleteAvatarMutation] = useMutation(DELETE_AVATAR);

    const handleDeleteAvatar = async () => {
        try {
            await deleteAvatarMutation({
                variables: {
                    avatar: {
                        userId: +user.id,
                    },
                },
            });

            setAvatar("/avatar.png");
            showAlert({ type: 'success', message: 'Avatar deleted successfully' });
        } catch (err) {
            showAlert({ type: 'error', message: 'Failed to delete avatar' });
            console.error(err);
        }
    };

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

    const email = user.email || "";
    const joinedAt = user.created_at ? new Date(+user.created_at).toLocaleDateString() : "";

    const { showAlert } = useAlert();
    const [uploadAvatarMutation] = useMutation(UPLOAD_AVATAR);

    const [avatar, setAvatar] = useState(user.profile.avatar || "/avatar.png");

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = (reader.result as string).split(',')[1];

            try {
                const { data } = await uploadAvatarMutation({
                    variables: {
                        avatar: {
                            userId: +user.id,
                            base64,
                            size: file.size,
                            type: file.type,
                        },
                    },
                });

                if (data?.uploadAvatar) {
                    setAvatar(data.uploadAvatar);
                    showAlert({ type: 'success', message: 'Avatar uploaded successfully' });
                }
            } catch (err) {
                showAlert({ type: 'error', message: 'Failed to upload avatar' });
                console.error(err);
            }
        };

        reader.readAsDataURL(file);
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                    <Box sx={{ position: "relative", width: 80, height: 80 }}>
                        <Avatar
                            src={avatar}
                            sx={{ width: 80, height: 80 }}
                        />
                        {avatar !== "/avatar.png" && (
                            <Button
                                onClick={handleDeleteAvatar}
                                variant="contained"
                                color="error"
                                sx={{
                                    minWidth: "unset",
                                    padding: "4px",
                                    position: "absolute",
                                    top: -8,
                                    right: -8,
                                    borderRadius: "50%",
                                    width: 28,
                                    height: 28,
                                    zIndex: 1
                                }}
                            >
                                <X size={16} />
                            </Button>
                        )}
                    </Box>

                    {user.id === id && (
                        <Button variant="outlined" component="label">
                            Upload Avatar
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleAvatarUpload}
                            />
                        </Button>
                    )}
                </Box>
            </Box>

            <Typography variant="subtitle1">Name: {user.profile.full_name}</Typography>
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
