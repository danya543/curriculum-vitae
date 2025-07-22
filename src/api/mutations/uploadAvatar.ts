import { gql } from '@apollo/client';

export const UPLOAD_AVATAR = gql`
  mutation UploadAvatar($avatar: UploadAvatarInput!) {
    uploadAvatar(avatar: $avatar)
  }
`;