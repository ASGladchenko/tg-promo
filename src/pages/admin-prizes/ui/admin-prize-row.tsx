import { type Prize } from "@/entities/prizes";
import { ButtonBase } from "@/shared/ui/button-base";

import "./admin-prize-row.scss";

type AdminPrizeRowProps = {
  prize: Prize;
};

export function AdminPrizeRow({ prize }: AdminPrizeRowProps) {
  return (
    <>
      <div className="grid-table__cell" role="cell">
        {prize.id}
      </div>
      <div className="grid-table__cell" role="cell">
        {prize.title}
      </div>
      <div className="grid-table__cell" role="cell">
        {prize.description}
      </div>
      <div className="grid-table__cell" role="cell">
        {prize.amount}
      </div>
      <div className="grid-table__cell" role="cell">
        {prize.status}
      </div>
      <div className="grid-table__cell admin-prize-row__actions" role="cell">
        <ButtonBase type="button">Edit</ButtonBase>
        <ButtonBase type="button">Delete</ButtonBase>
      </div>
    </>
  );
}
