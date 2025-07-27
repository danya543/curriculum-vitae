import { useQuery } from "@apollo/client";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import {
    Box,
    CircularProgress,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { GET_CVS } from "@/api/queries/getCVs";
import { CvCard } from "@/components/CVCard/CVCard";
import { useAuth } from "@/hooks/useAuth";
import type { Cv, CvsData } from "@/types/types";
import { useAlert } from "@/ui/Alert/useAlert";

import { AddCV } from "./AddCV";

export const CVs = () => {
    const { id } = useAuth();
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const { data, loading, error } = useQuery<CvsData>(GET_CVS, {
        variables: { id },
    });

    const [search, setSearch] = useState("");
    const [cvs, setCvs] = useState<Cv[]>([]);

    useEffect(() => {
        if (data?.cvs) setCvs(data.cvs);
    }, [data]);

    const handleAddCV = (newCv: Cv) => {
        setCvs(prev => [newCv, ...prev]);
    };

    const handleDeleteSuccess = (id: number) => {
        setCvs((prev) => prev.filter((cv) => cv.id !== id));
    };

    const filteredCvs = cvs.filter((cv) =>
        cv.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <CircularProgress />;
    if (error)
        return <Typography color="error">Error loading CVs: {error.message}</Typography>;

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
                <AddCV onCreateSuccess={handleAddCV} />
            </Box>

            {cvs.length > 0 && (
                <TextField
                    fullWidth
                    label="Search CV by name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ mb: 3 }}
                />
            )}

            {filteredCvs.length > 0 ? (
                filteredCvs.map((cv) => (
                    <CvCard
                        key={cv.id}
                        cv={cv}
                        onClick={() => navigate(`/cvs/${cv.id}`)}
                        onDeleteSuccess={handleDeleteSuccess}
                        showAlert={showAlert}
                    />
                ))
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: 10,
                        opacity: 0.6,
                    }}
                >
                    <InsertDriveFileOutlinedIcon sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h6" align="center">
                        No CVs left
                    </Typography>
                </Box>
            )}
        </Box>
    );
};
