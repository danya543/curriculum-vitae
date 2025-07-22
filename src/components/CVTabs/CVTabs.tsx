import { Box, Tab, Tabs } from "@mui/material";
import React from "react";

import type { CVTabKey } from "@/pages/CV/CV";
import type { CVTabsProps, TabPanelProps } from "@/types/types";

const tabIndexToKey: CVTabKey[] = ['details', 'skills', 'projects', 'preview'];
const tabKeyToIndex: Record<CVTabKey, number> = {
    details: 0,
    skills: 1,
    projects: 2,
    preview: 3,
};

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`cv-tabpanel-${index}`}
            aria-labelledby={`cv-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
        </div>
    );
}

export const CVTabs: React.FC<CVTabsProps> = ({
    details,
    skills,
    projects,
    preview,
    activeTab = 'details',
    onTabChange,
}) => {
    const value = tabKeyToIndex[activeTab] ?? 0;

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        const newTabKey = tabIndexToKey[newValue];
        onTabChange?.(newTabKey);
    };

    return (
        <>
            <Tabs value={value} onChange={handleChange} aria-label="CV tabs">
                <Tab label="Details" id="cv-tab-0" aria-controls="cv-tabpanel-0" />
                <Tab label="Skills" id="cv-tab-1" aria-controls="cv-tabpanel-1" />
                <Tab label="Projects" id="cv-tab-2" aria-controls="cv-tabpanel-2" />
                <Tab label="Preview" id="cv-tab-3" aria-controls="cv-tabpanel-3" />
            </Tabs>

            <TabPanel value={value} index={0}>{details}</TabPanel>
            <TabPanel value={value} index={1}>{skills}</TabPanel>
            <TabPanel value={value} index={2}>{projects}</TabPanel>
            <TabPanel value={value} index={3}>{preview}</TabPanel>
        </>
    );
};
