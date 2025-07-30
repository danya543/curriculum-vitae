import ArrowDownward from "@mui/icons-material/ArrowDownward";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import { Box } from "@mui/material";

export type SortOrder = "asc" | "desc";

interface HeaderColumn<K extends string> {
    key: K;
    label: string;
}

interface SortHeaderProps<K extends string> {
    columns: HeaderColumn<K>[];
    sortKey: K;
    sortOrder: SortOrder;
    onSort: (key: K) => void;
}

export const SortHeader = <K extends string>({ columns, sortKey, sortOrder, onSort }: SortHeaderProps<K>) => {
    return (
        <Box
            sx={{
                width: '95%',
                display: "grid",
                gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
                gap: 2,
                px: 2,
                py: 1,
                borderRadius: 2,
                fontWeight: "bold",
                color: "text.secondary",
                mb: 1,
                cursor: "pointer",
                userSelect: "none",
            }}
        >
            {columns.map(({ key, label }) => {
                const isActive = sortKey === key;
                return (
                    <Box
                        key={key}
                        onClick={() => onSort(key)}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                        }}
                    >
                        {label}
                        {isActive &&
                            (sortOrder === "asc" ? (
                                <ArrowUpward sx={{ fontSize: 16 }} />
                            ) : (
                                <ArrowDownward sx={{ fontSize: 16 }} />
                            ))}
                    </Box>
                );
            })}
        </Box>
    );
};
