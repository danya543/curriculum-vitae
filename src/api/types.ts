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
