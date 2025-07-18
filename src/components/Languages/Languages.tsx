import { useQuery } from "@apollo/client";
import {
    Box,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@mui/material";

import { GET_LANGUAGES } from "@/api/queries/getLanguages";

export interface Language {
    id: string;
    created_at: string;
    iso2: string;
    name: string;
    native_name: string;
}

export interface LanguagesData {
    languages: Language[];
}

export const Languages = () => {
    const { data, loading, error } = useQuery<LanguagesData>(GET_LANGUAGES);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">Error loading languages</Typography>;

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Languages
            </Typography>
            <List>
                {data?.languages.map(lang => (
                    <ListItem key={lang.id} divider>
                        <ListItemText
                            primary={`${lang.name} (${lang.iso2})`}
                            secondary={`Native: ${lang.native_name}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};
