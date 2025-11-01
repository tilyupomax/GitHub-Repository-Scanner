import type { ButtonProps as MuiButtonProps } from "@mui/material/Button";

import MuiButton from "@mui/material/Button";

export type ButtonProps = MuiButtonProps;

/**
 * Custom Button component wrapping MUI Button with project-specific defaults
 */
export function Button({ children, variant = "contained", ...props }: ButtonProps) {
  return (
    <MuiButton variant={variant} {...props}>
      {children}
    </MuiButton>
  );
}
