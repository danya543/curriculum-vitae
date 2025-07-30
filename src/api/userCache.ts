import { ApolloClient, type NormalizedCacheObject } from '@apollo/client';

import { GET_USER } from '@/api/queries/getUser';

export const patchUserInCache = (
    client: ApolloClient<NormalizedCacheObject>,
    userId: string,
    patch: {
        first_name?: string;
        last_name?: string;
        full_name?: string;
        avatar?: string | null;
    }
) => {
    const existing = client.readQuery({
        query: GET_USER,
        variables: { userId },
    });

    if (!existing?.user) return;

    client.writeQuery({
        query: GET_USER,
        variables: { userId },
        data: {
            user: {
                ...existing.user,
                profile: {
                    ...existing.user.profile,
                    ...patch,
                    __typename: existing.user.profile.__typename || 'Profile',
                },
                __typename: existing.user.__typename || 'User',
            },
        },
    });
};
