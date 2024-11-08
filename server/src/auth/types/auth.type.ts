export type AuthData = {
  userId: number;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};
