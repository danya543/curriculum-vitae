import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

type BreadcrumbItem = {
    label: string;
    to?: string;
};

type BreadcrumbsNavProps = {
    breadcrumbs: BreadcrumbItem[];
};

export const BreadcrumbsNav = ({ breadcrumbs }: BreadcrumbsNavProps) => {
    return (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            {breadcrumbs.map((item, index) =>
                item.to ? (
                    <Link
                        key={index}
                        component={RouterLink}
                        to={item.to}
                        underline="hover"
                        color="inherit"
                    >
                        {item.label}
                    </Link>
                ) : (
                    <Typography key={index} color="text.primary">
                        {item.label}
                    </Typography>
                )
            )}
        </Breadcrumbs>
    );
};
