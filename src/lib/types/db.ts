export type User = {
  id: string;
  isCoach: boolean;
  username: string;
  email: string;
  provider: "github" | "credentials";
  avartarUrl: string;
};
