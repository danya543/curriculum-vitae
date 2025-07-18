import { Breadcrumbs, Link, Typography } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

interface BreadcrumbsNavProps {
    cvName: string;
}

export const BreadcrumbsNav: React.FC<BreadcrumbsNavProps> = ({ cvName }) => {
    return (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link component={RouterLink} to="/cvs" underline="hover" color="inherit">
                CVs
            </Link>
            <Typography color="text.primary">{cvName}</Typography>
        </Breadcrumbs>
    );
};
