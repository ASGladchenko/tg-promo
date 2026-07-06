import { ButtonBase } from "../button-base";
import { CircularProgressLoader } from "../circular-progress-loader";

type ButtonLoadingProps = React.ComponentPropsWithoutRef<typeof ButtonBase> & {
  isLoading: boolean;
  sizeCircularProgress?: number | string;
};

export function ButtonLoading({
  children,
  isLoading,
  sizeCircularProgress = "1.25em",
  ...props
}: ButtonLoadingProps) {
  return (
    <ButtonBase {...props}>
      {isLoading ? <CircularProgressLoader size={sizeCircularProgress} /> : children}
    </ButtonBase>
  );
}
