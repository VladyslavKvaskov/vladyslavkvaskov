"use client";
import { Box, Link, Typography } from "@mui/material";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import { Cards } from "../components/cards";
import { useData } from "../providers/data-provider";
import { WaveImage } from "../components/wave-image";

export const Experience = () => {
  const { experience } = useData();

  return (
    <div>
      <Typography
        variant="h4"
        sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}
      >
        <WorkOutlineOutlinedIcon fontSize="large" /> Experience
      </Typography>
      <Cards
        animationName="experience"
        idKey="companyName"
        items={experience}
        size={{ xs: 12, sm: 12, md: 6 }}
        renderCard={(
          { companyName, logo, role, linkedInLink, from, to, type },
          isViewing,
        ) => (
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <WaveImage googleDriveImageID={logo} alt={`${companyName} logo`} />
            <div>
              <Typography
                variant="h6"
                component="strong"
                sx={{ fontWeight: 700 }}
              >
                {role}
              </Typography>
              <Typography color="textSecondary">
                <Link
                  href={linkedInLink}
                  underline="hover"
                  onClick={
                    !isViewing ? (event) => event.preventDefault() : undefined
                  }
                >
                  {companyName}
                </Link>{" "}
                • {type}
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                {from} — {to}
              </Typography>
            </div>
          </Box>
        )}
      />
    </div>
  );
};
