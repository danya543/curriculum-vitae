import { useQuery } from "@apollo/client";
import {
    Box,
    CircularProgress,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { GET_CVS } from "@/api/queries/getCVs";
import { getId } from "@/components/constants";
import { CvCard } from "@/components/CVCard/CVCard";

import { AddCV } from "./AddCV";

interface Skill {
    skill: {
        id: string;
        name: string;
    };
    level: string;
}

interface Language {
    language: {
        id: string;
        name: string;
    };
    level: string;
}

interface Project {
    id: string;
    name: string;
    description: string;
}

interface Cv {
    id: number;
    created_at: string;
    name: string;
    education: string | null;
    description: string;
    skills: Skill[];
    languages: Language[];
    projects: Project[];
}

interface CvsData {
    cvs: Cv[];
}

export const CVs = () => {
    const userId = getId();
    const navigate = useNavigate();
    const { data, loading, error } = useQuery<CvsData>(GET_CVS, {
        variables: { userId },
    });

    const [search, setSearch] = useState("");

    if (loading) return <CircularProgress />;
    if (error)
        return <Typography color="error">Error loading CVs: {error.message}</Typography>;

    const filteredCvs = data?.cvs.filter((cv) =>
        cv.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box sx={{ p: 3 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                    pt: 1,
                }}
            >
                <Typography variant="h4" component="h1">
                    CVs
                </Typography>
                <AddCV />
            </Box>

            <TextField
                fullWidth
                label="Search CV by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 3 }}
            />

            {filteredCvs && filteredCvs.length > 0 ? (
                filteredCvs.map((cv) => (
                    <CvCard key={cv.id} cv={cv} onClick={() => navigate(`/cvs/${cv.id}`)} />
                ))
            ) : (
                <Typography>No CVs found</Typography>
            )}
        </Box>
    );
};
