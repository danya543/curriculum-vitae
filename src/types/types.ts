type LanguageInput = {
    name: string;
    proficiency: string;
};

type SkillInput = {
    name: string;
    categoryId: string;
    mastery: string;
};

export interface SkillsTabProps {
    skills: SkillInput[];
}

type ProjectInput = {
    name: string;
    internal_name: string;
    description: string;
    domain: string;
    start_date: string;
    end_date: string;
    environment: string;
    roles: string;
    responsibilities: string;
};

export type CvFormState = {
    name: string;
    education: string;
    description: string;
    languages: LanguageInput[];
    skills: SkillInput[];
    projects: ProjectInput[];
};


export interface Cv extends CvFormState {
    id: number;
    created_at: string;
}

export interface CvsData {
    cvs: Cv[];
}

export interface CvCardProps {
    cv: {
        id: number;
        name: string;
        education: string | null;
        description: string;
    };
    onClick: (id: number) => void;
    onDeleteSuccess: (cvId: number) => void;
    showAlert: (options: { type: "success" | "error" | "info"; message: string }) => void;
}

export interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export interface CVTabsProps {
    details: React.ReactNode;
    skills: React.ReactNode;
    projects: React.ReactNode;
    preview: React.ReactNode;
}

export interface DetailsTabProps {
    description: string;
    education: string | null;
    createdAt: string;
}

export interface PreviewTabProps {
    cvName: string;
    description: string;
}


export interface Project {
    id: string;
    name: string;
    description: string;
}

export interface ProjectsTabProps {
    projects: Project[];
}


interface Department {
    id: string;
    name: string;
    created_at: string;
}

export interface DepartmentsData {
    departments: Department[];
}

export interface DepartmentsProps {
    department: string;
    onChange: (value: string) => void;
}

export interface PositionsProps {
    position: string;
    onChange: (value: string) => void;
}

export interface SideMenuProps {
    open: boolean
    toggleMenu: () => void
}

export interface UserCardProps {
    id: string
    firstName: string
    lastName: string
    email: string
    departmentName?: string
    positionName?: string
    avatarUrl?: string
}


export interface AlertPortalProps {
    type: 'success' | 'error' | 'info'
    message: string
    duration?: number
}