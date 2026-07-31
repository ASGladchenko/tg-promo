import { type UsersAnalyticsResponseDto } from "../api/types";
import { type UsersAnalytics } from "../model/types";

export function mapUsersAnalyticsDtoToUsersAnalytics(dto: UsersAnalyticsResponseDto): UsersAnalytics {
  return {
    activeUsers: {
      ...dto.activeUsers
    },
    range: {
      ...dto.range
    },
    users: {
      ...dto.users
    }
  };
}
