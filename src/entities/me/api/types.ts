export type MeDto = {
  email: string | null;
  id: string;
  isChannelSubscribed: boolean | null;
  imgUrl: string | null;
  login: string | null;
  name: string | null;
  permissions?: string[];
  phone: string | null;
  provider: string | null;
  roles: string[];
  surname: string | null;
};
