import { type MeDto } from "../api/types";
import { type Me } from "../model/types";

export function mapMeDtoToMe(dto: MeDto): Me {
  const me: Me = {
    email: dto.email,
    id: dto.id,
    imgUrl: dto.imgUrl,
    login: dto.login,
    name: dto.name,
    phone: dto.phone,
    provider: dto.provider,
    roles: [...dto.roles],
    surname: dto.surname
  };

  if (dto.permissions !== undefined) {
    me.permissions = [...dto.permissions];
  }

  return me;
}
