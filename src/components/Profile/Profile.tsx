// Profile.tsx
import {
    Avatar,
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";

type UserType = {
    profile: {
        first_name: string;
        last_name: string;
        email?: string; // если email есть в profile, иначе user.email из API
        avatar_url?: string; // пример, если есть
    };
    email?: string;
    created_at?: string;
    department_name?: string;
    position_name?: string;
};

type ProfileProps = {
    user: UserType;
};

export const Profile = ({ user }: ProfileProps) => {
    const firstName = user.profile.first_name;
    const lastName = user.profile.last_name;
    const email = user.email || user.profile.email || "";
    const joinedAt = user.created_at ? user.created_at.split("T")[0] : "";
    const department = user.department_name || "";
    const position = user.position_name || "";
    const avatarUrl = user.profile.avatar_url || "/avatar.png";

    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Avatar src={avatarUrl} sx={{ width: 80, height: 80 }} />
                <Button variant="outlined" component="label">
                    Upload Avatar
                    <input type="file" hidden accept="image/*" />
                </Button>
            </Box>

            <Typography variant="subtitle1">Name: {firstName} {lastName}</Typography>
            <Typography variant="subtitle1">Email: {email}</Typography>
            <Typography variant="subtitle1">Joined: {joinedAt}</Typography>

            <Box component="form" sx={{ mt: 4 }} noValidate autoComplete="off">
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <TextField fullWidth label="First Name" defaultValue={firstName} />
                    </Grid>
                    <Grid size={6}>
                        <TextField fullWidth label="Last Name" defaultValue={lastName} />
                    </Grid>
                    <Grid size={6}>
                        <FormControl fullWidth>
                            <InputLabel>Department</InputLabel>
                            <Select defaultValue={department} label="Department">
                                <MenuItem value="IT">IT</MenuItem>
                                <MenuItem value="HR">HR</MenuItem>
                                <MenuItem value="Sales">Sales</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={6}>
                        <FormControl fullWidth>
                            <InputLabel>Position</InputLabel>
                            <Select defaultValue={position} label="Position">
                                <MenuItem value="Frontend Developer">Frontend Developer</MenuItem>
                                <MenuItem value="Backend Developer">Backend Developer</MenuItem>
                                <MenuItem value="Manager">Manager</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={6}>
                        <Button variant="contained">Save Changes</Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};
