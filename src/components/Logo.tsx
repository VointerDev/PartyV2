import { LOGO_ALT, LOGO_SRC } from "../logo";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return <img src={LOGO_SRC} alt={LOGO_ALT} className={className} />;
}
