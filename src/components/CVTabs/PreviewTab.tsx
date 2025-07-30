import { useMutation, useQuery } from "@apollo/client";
import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useMemo } from "react";

import { EXPORT_PDF } from "@/api/mutations/exportPdf";
import { GET_SKILL_CATEGORIES } from "@/api/queries/getSkillCategories";
import type { Cv } from "@/types/types";

import { PdfPreview } from "./PdfPreview";
interface PreviewTabProps {
    cv: Cv;
}

export const PreviewTab: React.FC<PreviewTabProps> = ({ cv }) => {
    const { data: categoryData } = useQuery<{ skillCategories: { id: string; name: string }[] }>(GET_SKILL_CATEGORIES);

    const categoryMap = useMemo(() => {
        const map: Record<string, string> = {};
        categoryData?.skillCategories.forEach(cat => {
            map[cat.id] = cat.name;
        });
        return map;
    }, [categoryData]);

    const groupedSkills = useMemo(() => {
        return cv.skills.reduce<Record<string, Cv["skills"]>>((acc, skill) => {
            const category = categoryMap[skill.categoryId!] || "Other";
            (acc[category] ??= []).push(skill);
            return acc;
        }, {});
    }, [cv.skills, categoryMap]);

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

    const experience = (new Date().getTime() - Number(cv.created_at)) / (1000 * 60 * 60 * 24 * 365.25)

    return (
        <Box>
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

            <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 4 }} >
                {cv.user.position_name}
            </Typography>

            <Stack spacing={2}>
                <Stack direction="row" gap={5}>
                    <Box sx={{ flex: 2 }}>
                        <Typography variant="subtitle2" fontWeight={600}>Education</Typography>
                        <Typography variant="body2" gutterBottom>{cv.education || "—"}</Typography>

                        {cv.languages.length > 0 && <Box>
                            <Typography variant="subtitle2" fontWeight={600}>Language proficiency</Typography>
                            {cv.languages.map(lang => (
                                <Typography key={lang.name} variant="body2">
                                    {lang.name} – {lang.proficiency}
                                </Typography>
                            ))}
                        </Box>}

                        {cv.projects.map(p => p.domain).filter(Boolean).length > 0 && <Box>
                            <Typography variant="subtitle2" fontWeight={600}>Domains</Typography>
                            <Typography variant="body2" gutterBottom>
                                {cv.projects.map(p => p.domain).filter(Boolean).join(', ')}
                            </Typography>
                        </Box>}
                    </Box>

                    <Box sx={{ flex: 3, pl: 5, borderLeft: '1px solid #c63031' }}>
                        <Typography variant="body2" gutterBottom>{cv.name}</Typography>

                        <Typography variant="body2" paragraph>{cv.description || "No description provided."}</Typography>

                        {Object.entries(groupedSkills).length > 0 && Object.entries(groupedSkills).map(([category, skills]) => (
                            <Box key={category} sx={{ mb: 1 }}>
                                <Typography variant="body2" fontWeight={600}>
                                    {category}
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: 14 }}>
                                    {skills.map(skill => skill.name).join(', ') + '.'}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Stack>

                {cv.projects.length > 0 && <Box>
                    <Typography variant="h4" fontWeight={600} gutterBottom>Projects</Typography>
                    {cv.projects.map((p) => (
                        <Box key={p.id} sx={{ display: 'flex', flexDirection: 'row', gap: 5, mb: 5 }}>
                            <Stack direction="column" flex={2}>
                                <Box >
                                    <Typography sx={{ color: '#c63031' }} variant="body1" fontWeight={500}>{p.name}</Typography>
                                </Box>
                                <Box >
                                    <Typography variant="body2" color="text.secondary">{p.description || "No description"}</Typography>
                                </Box>
                            </Stack>

                            <Stack flex={3} direction="column" sx={{ pl: 5, gap: '10px', borderLeft: '1px solid #c63031' }}>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight={600}>Project roles</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {p.roles.length > 0 ? p.roles.join(',') : (cv.user.position_name || "No description")}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" fontWeight={600}>Period</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {p.start_date} - {p.end_date || 'Till now'}
                                    </Typography>
                                </Box>

                                {p.responsibilities.length > 0 && <Box>
                                    <Typography variant="subtitle2" fontWeight={600}>Responsibilities</Typography>
                                    <ul style={{ paddingLeft: 15, margin: 0 }}>
                                        {p.responsibilities.map((resp, idx) => (
                                            <li key={idx}>
                                                <Typography variant="body2" color="text.secondary">{resp}</Typography>
                                            </li>
                                        ))}
                                    </ul>
                                </Box>}

                                {p.environment.length > 0 && <Box>
                                    <Typography variant="subtitle2" fontWeight={600}>Environment</Typography>
                                    <Typography variant="body2" color="text.secondary">{p.environment.join(', ')}.</Typography>
                                </Box>}
                            </Stack>
                        </Box>
                    ))}
                </Box>}

                {Object.entries(groupedSkills).length > 0 && <Box sx={{ mt: 3 }}>
                    <Typography variant="h4" fontWeight={600}>Professional skills</Typography>

                    <Stack direction="row" sx={{ fontWeight: 600, borderBottom: '1px solid #c63031', pb: 1 }}>
                        <Box sx={{ flex: 2 }}>Skill</Box>
                        <Box sx={{ flex: 1 }}>Experience (years)</Box>
                        <Box sx={{ flex: 1 }}>Last used</Box>
                    </Stack>

                    {Object.entries(groupedSkills).map(([category, skills]) => (
                        <Box key={category} sx={{ mt: 2, borderBottom: '1px solid #eee' }}>
                            {skills.map((skill, index) => (
                                <Stack key={skill.name} direction="row" sx={{ alignItems: 'center', py: 0.5 }}>
                                    <Box sx={{ flex: 1 }}>
                                        {index === 0 &&
                                            <Typography variant="subtitle2" sx={{ color: '#c63031' }} fontWeight={600}>
                                                {category}
                                            </Typography>}
                                    </Box>
                                    <Box sx={{ flex: 1, pl: 2 }}>{skill.name}</Box>
                                    <Box sx={{ flex: 1 }}>{experience < 1 ? '<1' : Math.floor(experience)}{ }</Box>
                                    <Box sx={{ flex: 1 }}> </Box>
                                </Stack>
                            ))}
                        </Box>
                    ))}
                </Box>}
            </Stack>
            <Box sx={{ display: 'none' }}>
                <PdfPreview cv={cv} groupedSkills={groupedSkills} experience={experience} />
            </Box>
        </Box >
    );
};
