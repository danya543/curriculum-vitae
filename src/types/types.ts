import type { CvProject } from "cv-graphql";

import type { User } from "@/api/types";
import type { Mastery } from "@/components/CVTabs/constants";

type LanguageInput = {
    name: string;
    proficiency: string;
};

export type SkillInput = {
    name: string;
    categoryId: string;
    categoryName: string;
    mastery: string;
};

export type MasteryLevel = typeof Mastery[number];
export interface Skill {
    id: string;
    name: string;
    category: { id: string };
    categoryId: string;
    category_name: string;
    category_parent_name: string;
    mastery: MasteryLevel;
}
export interface Skills {
    skills: Skill[];
}
export interface SkillsTabProps {
    initialSkills: Skill[];
    cvId: number;
}

type ProjectInput = {
    id: string;
    name: string;
    internal_name: string;
    description: string;
    domain: string;
    start_date: string;
    end_date: string;
    environment: [string];
    roles: [string];
    responsibilities: [string];
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
    user: { email: string, position_name: string, department_name: string, profile: { full_name: string } }
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
        user: { email: string }
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
    activeTab?: 'details' | 'skills' | 'projects' | 'preview';
    onTabChange?: (newTabKey: 'details' | 'skills' | 'projects' | 'preview') => void;
}

export interface DetailsTabProps {
    name: string;
    description: string;
    education: string | null;
    createdAt: string;
    cvId: number;
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
    projects: CvProject[];
    cvId: number;
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
    disabled: boolean;
}

export interface PositionsProps {
    position: string;
    onChange: (value: string) => void;
    disabled: boolean;
}

export interface SideMenuProps {
    open: boolean
    toggleMenu: () => void
}

export interface UserCardProps {
    user: User,
    isCurrentUser: boolean
}


export interface AlertPortalProps {
    type: 'success' | 'error' | 'info'
    message: string
    duration?: number
}

export interface SkillCategory {
    id: string;
    name: string;
    order: number;
    parent?: {
        id: string;
        name: string;
    } | null;
    children: {
        id: string;
        name: string;
    }[];
}
