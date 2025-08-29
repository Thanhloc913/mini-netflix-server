export type CreateProfileDto = {
  accountId: string;
  name: string;
  avatarUrl?: string;
};

export type UpdateProfileDto = {
  name: string;
  avatarUrl?: string;
};
