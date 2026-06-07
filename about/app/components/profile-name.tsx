import { Box, SvgIconProps, Typography, TypographyProps } from "@mui/material";
import { useData } from "../providers/data-provider";
import { Verified } from "@mui/icons-material";

export const ProfileName = ({
  TypographyProps,
  SvgIconProps,
}: {
  TypographyProps?: TypographyProps;
  SvgIconProps?: SvgIconProps;
}) => {
  const {
    profile: { name },
  } = useData();

  return (
    <Typography
      component="div"
      {...TypographyProps}
      sx={{
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        gap: 1,
        ...TypographyProps?.sx,
      }}
    >
      <Box
        sx={{
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        {name}
      </Box>
      <Verified color="primary" {...SvgIconProps} />
    </Typography>
  );
};
