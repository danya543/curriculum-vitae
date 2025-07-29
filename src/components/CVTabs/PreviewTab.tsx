import { useMutation } from "@apollo/client";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import React from "react";

import { EXPORT_PDF } from "@/api/mutations/exportPdf";
import type { Cv } from "@/types/types";

interface PreviewTabProps {
    cv: Cv;
}

export const PreviewTab: React.FC<PreviewTabProps> = ({ cv }) => {
    const [exportPdf, { loading }] = useMutation(EXPORT_PDF);
    const handleExport = async () => {
        const htmlContent = document.getElementById("pdf-root")?.outerHTML;

        if (!htmlContent) {
            console.error("HTML content not found");
            return;
        }

        try {
            const { data } = await exportPdf({
                variables: {
                    html: htmlContent,
                    margin: {
                        top: "1cm",
                        bottom: "1cm",
                        left: "1cm",
                        right: "1cm",
                    },
                },
            });

            const base64String = data.exportPdf;

            const byteCharacters = atob(base64String);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "application/pdf" });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${cv.user.profile.full_name}_CV.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export failed", error);
        }
    };


    return (
        <Box sx={{ px: 3, py: 2 }}>
            <div id="pdf-root">
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" fontWeight={600}>
                        {cv.user.profile.full_name}
                    </Typography>
                    <Button
                        sx={{
                            color: "#c63031",
                            border: "1px solid #c63031",
                            borderRadius: 5,
                        }}
                        variant="outlined"
                        onClick={handleExport}
                        disabled={loading}
                    >
                        Export PDF
                    </Button>
                </Stack>

                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {cv.user.position_name}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600}>Education</Typography>
                        <Typography variant="body2" gutterBottom>{cv.education || "—"}</Typography>

                        <Typography variant="subtitle2" fontWeight={600}>Language proficiency</Typography>
                        {cv.languages.map(lang => (
                            <Typography key={lang.name} variant="body2">
                                {lang.name} – {lang.proficiency}
                            </Typography>
                        ))}

                        <Typography variant="subtitle2" fontWeight={600}>Domains</Typography>
                        <Typography variant="body2" gutterBottom>{cv.projects.map(p => p.domain).filter(Boolean).join(', ')}</Typography>

                        <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 2 }}>Skills</Typography>
                        {cv.skills.map(skill => (
                            <Box key={skill.name} sx={{ mb: 0.5 }}>
                                <Typography variant="body2">
                                    {skill.name} – {skill.mastery}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    <Box sx={{ flex: 2 }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Software Engineer with experience
                        </Typography>
                        <Typography variant="body2" paragraph>{cv.description || "No description provided."}</Typography>

                        <Typography variant="h4" fontWeight={600} gutterBottom>Projects</Typography>
                        {cv.projects.map((p) => (
                            <Box key={p.id} sx={{ mb: 2 }}>
                                <Typography sx={{ color: '#c63031' }} variant="body1" fontWeight={500}>{p.name}</Typography>
                                <Typography variant="body2" color="text.secondary">{p.description || "No description"}</Typography>

                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>Project roles</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {p.roles.length > 0 ? p.roles.join(',') : (cv.user.position_name || "No description")}
                                </Typography>

                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>Period</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {p.start_date} - {p.end_date || 'Till now'}
                                </Typography>

                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>Responsibilities</Typography>
                                <ul>
                                    {p.responsibilities.map((resp, idx) => (
                                        <li key={idx}>
                                            <Typography variant="body2" color="text.secondary">{resp}</Typography>
                                        </li>
                                    ))}
                                </ul>

                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>Environment</Typography>
                                <Typography variant="body2" color="text.secondary">{p.environment.join(', ')}</Typography>
                            </Box>
                        ))}

                        <Typography variant="h4" fontWeight={600} gutterBottom>Professional skills</Typography>
                    </Box>
                </Stack>
            </div>
        </Box>
    );
};
