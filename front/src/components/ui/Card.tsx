import type { CardProps as MuiCardProps } from "@mui/material/Card";

import MuiCard from "@mui/material/Card";

export type CardProps = MuiCardProps;

/**
 * Custom Card component wrapping MUI Card with project-specific defaults
 */
export function Card({ children, ...props }: CardProps) {
  return <MuiCard {...props}>{children}</MuiCard>;
}
