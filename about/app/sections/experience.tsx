"use client";
import { Link, Paper, Typography } from "@mui/material";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import { Cards } from "../components/cards";
import { useData } from "../providers/data-provider";
import { WaveImage } from "../components/wave-image";
import type { Experience as ExperienceType } from "../types";
import { useRef } from "react";
import { useStickyObserver } from "../hooks/use-sticky-observer";

const ExperienceCard = ({
  companyName,
  logo,
  role,
  linkedInLink,
  from,
  to,
  type,
  isViewing,
}: Omit<ExperienceType, "description"> & { isViewing: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isSticky = useStickyObserver({ ref });

  return (
    <Paper
      ref={ref}
      sx={{
        display: "flex",
        gap: 2,
        position: "sticky",
        top: "-1px",
        px: 5,
        mt: 3,
        py: 2,
        borderRadius: "unset",
        boxShadow: (theme) =>
          isSticky ? theme.shadows[5] : "unset !important",
      }}
    >
      <WaveImage googleDriveImageID={logo} alt={`${companyName} logo`} />
      <div>
        <Typography variant="h6" component="strong" sx={{ fontWeight: 700 }}>
          {role}
        </Typography>
        <Typography color="textSecondary">
          <Link
            href={linkedInLink}
            underline="hover"
            onClick={!isViewing ? (event) => event.preventDefault() : undefined}
          >
            {companyName}
          </Link>{" "}
          • {type}
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          {from} — {to}
        </Typography>
      </div>
    </Paper>
  );
};

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
        renderCard={(item, isViewing) => (
          <ExperienceCard {...item} isViewing={isViewing} />
        )}
      />
    </div>
  );
};
