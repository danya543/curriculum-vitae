export interface User {
    id: string
    email: string
    created_at: string
    is_verified: boolean
    role: string
    department_name?: string
    position_name?: string
    profile: {
        first_name: string
        last_name: string
        phone?: string
        address?: string
    }
    department?: {
        id: string
        name: string
    }
    position?: {
        id: string
        name: string
    }
    cvs: {
        id: string
        title: string
        created_at: string
    }[]
}

export interface GetUsersData {
    users: User[]
}

export interface Language {
    id: string;
    created_at: string;
    iso2: string;
    name: string;
    native_name: string;
}

export interface LanguagesData {
    languages: Language[];
}


interface Position {
    id: string;
    name: string;
    created_at: string;
}

export interface PositionsData {
    positions: Position[];
}


interface Category {
    id: string;
    name: string;
}

export interface Skill {
    id: string;
    created_at: string;
    name: string;
    category: Category | null;
    category_name: string | null;
    category_parent_name: string | null;
}

export interface SkillsData {
    skills: Skill[];
}