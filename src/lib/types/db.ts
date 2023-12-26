export type User = {
  id: string;
  isCoach: boolean;
  username: string;
  email: string;
  provider: "github" | "credentials";
  avartarUrl: string;
  hasProfile: boolean;
};

export type UserInfo = {
  displayName: string,
  sportType: string,
  age: string,
  height: string,
  weight: string,
  place?: string,
  license?: string,
};
