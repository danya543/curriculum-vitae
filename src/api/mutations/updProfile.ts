import { gql, useMutation } from '@apollo/client';

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($profile: UpdateProfileInput!) {
    updateProfile(profile: $profile) {
      first_name
      last_name
    }
  }
`;

type UpdateProfileInput = {
    userId: number;
    first_name: string;
    last_name: string;
};

export const useUpdateProfile = () => {
    const [updateProfileMutation, { data, loading, error }] = useMutation(UPDATE_PROFILE);

    const updateProfile = (profile: UpdateProfileInput) => {
        return updateProfileMutation({
            variables: { profile },
        });
    };

    return { updateProfile, data, loading, error };
};