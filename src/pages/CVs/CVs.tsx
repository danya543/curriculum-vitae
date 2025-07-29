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
import { BreadcrumbsNav } from "@/components/Nav/Nav";
import { SortHeader } from "@/components/SortHeader/SortHeader";
import { useAuth } from "@/hooks/useAuth";
import type { Cv, CvsData } from "@/types/types";
import { useAlert } from "@/ui/Alert/useAlert";

import { AddCV } from "./AddCV";

const columns = Array.from([
    { key: "name", label: "Name" },
    { key: "education", label: "Education" },
    { key: "employeeName", label: "Employee" },
] as const);

type SortKey = (typeof columns)[number]["key"];
type SortOrder = "asc" | "desc";

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

    const [sortKey, setSortKey] = useState<SortKey>("name");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    const filteredCvs = cvs.filter((cv) =>
        cv.name.toLowerCase().includes(search.toLowerCase())
    );

    const sortedCvs = [...filteredCvs].sort((a, b) => {
        const getValue = (cv: Cv) => {
            switch (sortKey) {
                case "name":
                    return cv.name.toLowerCase();
                case "education":
                    return (cv.education || "").toLowerCase();
                case "employeeName":
                    return cv.user?.email.toLowerCase() || "";
                default:
                    return "";
            }
        };

        const aValue = getValue(a);
        const bValue = getValue(b);

        return sortOrder === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
    });



    if (loading) return <CircularProgress />;
    if (error)
        return <Typography color="error">Error loading CVs: {error.message}</Typography>;
    const breadcrumbs = [
        { label: "CVs" },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <BreadcrumbsNav breadcrumbs={breadcrumbs} />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                    pt: 1,
                }}
            >
                {cvs.length > 0 && (
                    <TextField
                        label="Search CV by name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{
                            width: '400px',
                            borderRadius: '10px',
                            p: '5px',
                            '& label.Mui-focused': { m: '5px', color: '#C63031' },
                            '& .MuiOutlinedInput-root': {
                                height: '40px',
                                borderRadius: '25px',
                                '&.Mui-focused fieldset': { borderColor: '#C63031' },
                            },
                        }}
                    />
                )}
                <AddCV />
            </Box>

            <SortHeader columns={columns} sortKey={sortKey} sortOrder={sortOrder} onSort={handleSort} />

            {sortedCvs.length > 0 ? (
                sortedCvs.map((cv) => (
                    <CvCard
                        key={cv.id}
                        cv={cv}
                        onClick={() => navigate(`/cvs/${cv.id}`)}
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
