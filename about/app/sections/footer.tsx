import {
  Container,
  Box,
  Grid,
  Typography,
  Link,
  Divider,
  Stack,
} from "@mui/material";
import { Email, Copyright } from "@mui/icons-material";
import { Socials } from "../components/socials";
import { useData } from "../providers/data-provider";
import { ProfileName } from "../components/profile-name";

export const Footer = () => {
  const { profile } = useData();
  const currentYear = new Date().getFullYear();

  const contactInfo = [
    {
      icon: <Email />,
      text: profile.email,
      href: `mailto:${profile.email}`,
    },
  ];

  return (
    <Box
      component="footer"
      role="contentinfo"
      sx={(theme) => ({
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.secondary,
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: "auto",
        py: theme.spacing(4),
        position: "relative",
        zIndex: 1,
      })}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ justifyContent: "space-between" }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <ProfileName
              TypographyProps={{
                variant: "h5",
                sx: {
                  mb: 2,
                },
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {profile.shortDescription}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Socials path="profile.socials" />
              <Socials path="profile.contacts" />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ mb: 2, fontWeight: 600 }}
            >
              Contact
            </Typography>
            <Stack spacing={1.5}>
              {contactInfo.map((item, index) => (
                <Box
                  key={index}
                  component={Link}
                  href={item.href}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    textDecoration: "none",
                    color: "text.secondary",
                    fontSize: "0.875rem",
                    transition: "color 0.2s ease",
                    "&:hover": { color: "primary.main" },
                    cursor: "pointer",
                  }}
                >
                  <Box sx={{ color: "primary.main", display: "flex" }}>
                    {item.icon}
                  </Box>
                  <Typography variant="body2">{item.text}</Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4 }} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
          }}
        >
          <Copyright fontSize="small" sx={{ fontSize: "0.875rem" }} />
          <Typography variant="body2" color="text.secondary">
            {currentYear} {profile.name}. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
