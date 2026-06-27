import { type MeDto } from "../api/types";

export function normalizeMeDto(dto: MeDto): MeDto {
  const meDto: MeDto = {
    email: dto.email,
    id: dto.id,
    isChannelSubscribed: dto.isChannelSubscribed,
    imgUrl: dto.imgUrl,
    login: dto.login,
    name: dto.name,
    phone: dto.phone,
    provider: dto.provider,
    roles: [...dto.roles],
    surname: dto.surname
  };

  if (dto.permissions !== undefined) {
    meDto.permissions = [...dto.permissions];
  }

  return meDto;
}
