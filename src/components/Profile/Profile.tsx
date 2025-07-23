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
import { useRef, useState } from "react";

import { DELETE_AVATAR } from "@/api/mutations/deleteAvatar";
import { useUpdateProfile } from "@/api/mutations/updProfile";
import { UPDATE_USER } from "@/api/mutations/updUser";
import { UPLOAD_AVATAR } from "@/api/mutations/uploadAvatar";
import { getId } from "@/components/constants";
import { Departments } from "@/components/Departments/Departments";
import { Positions } from "@/components/Positions/Positions";
import { useAlert } from "@/ui/Alert/useAlert";
import { ICONS } from "@/ui/constants";

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
    department: {
        id: string;
        name: string;
    }
    position: {
        id: string;
        name: string;
    }
    position_name?: string;
    is_verified: boolean;
};

type ProfileProps = {
    user: UserType;
};

export const Profile = ({ user }: ProfileProps) => {
    const [initialState, setInitialState] = useState({
        firstName: user.profile.first_name,
        lastName: user.profile.last_name,
        department: user.department?.id || "",
        position: user.position?.id || "",
    });
    const inputFileRef = useRef<HTMLInputElement | null>(null);
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
                                id: +user.id,
                                departmentId: form.department || '',
                                positionId: form.position || '',
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
                            departmentId: form.department || '',
                            positionId: form.position || '',
                        },
                    },
                });
            } else {
                return;
            }
            setInitialState(form);
            showAlert({ type: "success", message: "Successfully updated" });
        } catch (err) {
            showAlert({ type: "error", message: "Failed to update" });
            console.error(err);
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

    const [updateUserMutation] = useMutation(UPDATE_USER);

    const [avatar, setAvatar] = useState(user.profile.avatar || "/avatar.png");

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
                            userId: user.id,
                            base64: result,
                            size: file.size,
                            type: file.type,
                        },
                    },
                });

                if (data?.uploadAvatar) {
                    setAvatar(data.uploadAvatar);
                    showAlert({ type: 'success', message: 'Avatar uploaded successfully' });
                    if (inputFileRef.current) {
                        inputFileRef.current.value = "";
                    }
                }
            } catch (err) {
                showAlert({ type: 'error', message: 'Failed to upload avatar' });
                console.error(err);
            }
        };

        reader.readAsDataURL(file);
    };

    return (
        <Box sx={{
            mt: 2, display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
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
                                sx={{
                                    color: '#757575',
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
                                <X size={24} />
                            </Button>
                        )}
                    </Box>

                    {user.id === id && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }} >
                            <Button variant="text" component="label" sx={{ color: 'white' }}>
                                <ICONS.Upload />Upload avatar image
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                />
                            </Button>
                            <Typography variant="subtitle1">png, jpg or gif no more than 0.5MB</Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            <Typography variant="subtitle1">Name: {user.profile.full_name}</Typography>
            <Typography variant="subtitle1">Email: {email}</Typography>
            <Typography variant="subtitle1">Joined: {joinedAt}</Typography>

            <Box component="form" sx={{ mt: 4 }} noValidate autoComplete="off" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <TextField
                            fullWidth
                            label="First Name"
                            value={form.firstName}
                            onChange={handleChange("firstName")}
                            disabled={id !== user.id}
                            sx={{
                                '& label.Mui-focused': {
                                    color: 'rgb(198, 48, 49)',
                                },
                                '& .MuiInput-underline:after': {
                                    borderBottomColor: 'rgb(198, 48, 49)',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'rgb(198, 48, 49)',
                                    },
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            value={form.lastName}
                            onChange={handleChange("lastName")}
                            disabled={id !== user.id}
                            sx={{
                                '& label.Mui-focused': {
                                    color: 'rgb(198, 48, 49)',
                                },
                                '& .MuiInput-underline:after': {
                                    borderBottomColor: 'rgb(198, 48, 49)',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'rgb(198, 48, 49)',
                                    },
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={6}>
                        <Departments department={form.department} onChange={handleDepartmentChange} disabled={id !== user.id} />
                    </Grid>
                    <Grid size={6}>
                        <Positions position={form.position} onChange={handlePositionChange} disabled={id !== user.id} />
                    </Grid>
                    {id === user.id && <Grid size={6}>
                        <Button
                            type="submit"
                            variant="text"
                            sx={{ color: 'rgb(198, 48, 49)' }}
                            disabled={!isChanged}
                        >
                            Save Changes
                        </Button>
                    </Grid>}
                </Grid>
            </Box>
        </Box >
    );
};
