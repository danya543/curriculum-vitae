import { useMutation } from "@apollo/client";
import {
    Box,
    Button,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { UPDATE_CV } from "@/api/mutations/updCV";
import type { DetailsTabProps } from "@/types/types";
import { useAlert } from "@/ui/Alert/useAlert";

import { redInputSx } from "../constants";

export const DetailsTab: React.FC<DetailsTabProps> = ({
    cvId,
    name,
    description,
    education,
    createdAt
}) => {
    const { showAlert } = useAlert();

    const [form, setForm] = useState({ name, description, education: education || "" });
    const [isChanged, setIsChanged] = useState(false);

    const [updateCv, { loading }] = useMutation(UPDATE_CV);

    useEffect(() => {
        setIsChanged(
            form.name !== name || form.description !== description || form.education !== (education || "")
        );
    }, [form, name, description, education]);

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleUpdate = async () => {
        try {
            await updateCv({
                variables: {
                    cv: {
                        cvId: cvId,
                        name: form.name,
                        description: form.description,
                        education: form.education,
                    },
                },
            });
            showAlert({ type: "success", message: "CV updated successfully" });
        } catch (err) {
            console.error("Failed to update CV", err);
            showAlert({ type: "error", message: "Failed to update CV" });
        }
    };

    return (
        <Box>
            <Stack spacing={2} mb={2}>
                <TextField
                    label="Name"
                    value={form.name}
                    sx={redInputSx}
                    onChange={(e) => handleChange("name", e.target.value)}
                />
                <TextField
                    label="Description"
                    multiline
                    minRows={3}
                    sx={redInputSx}
                    value={form.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                />
                <TextField
                    label="Education"
                    value={form.education}
                    sx={redInputSx}
                    onChange={(e) => handleChange("education", e.target.value)}
                />
                <Typography variant="caption" color="text.secondary">
                    Created at: {new Date(+createdAt).toLocaleDateString()}
                </Typography>
            </Stack>

            <Button
                variant="contained"
                onClick={handleUpdate}
                sx={{ background: '#c63031' }}
                disabled={!isChanged || loading}
            >
                {loading ? "Updating..." : "Update"}
            </Button>
        </Box>
    );
};
