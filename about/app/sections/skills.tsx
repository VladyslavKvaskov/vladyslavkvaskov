"use client";
import { useRef } from "react";
import { Typography, Paper, Box } from "@mui/material";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import { Cards } from "../components/cards";
import { useWebGLImageWave } from "../hooks/use-wave-effect";
import { useData } from "../providers/data-provider";
import { WaveImage } from "../components/wave-image";
import { useStickyObserver } from "../hooks/use-sticky-observer";

const SkillCardItem = ({ name, logo }: { name: string; logo: string }) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const ref = useRef<HTMLDivElement>(null);
  const isSticky = useStickyObserver({ ref });

  useWebGLImageWave(containerRef, imageRef, {
    waveSpeed: 3.0,
    waveFrequency: 4.5,
    waveAmplitude: 5.0,
  });

  return (
    <Paper
      ref={ref}
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "start",
        width: "100%",
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
      <WaveImage googleDriveImageID={logo} alt={`${name} logo`} />
      <Typography variant="h6" component="strong" sx={{ fontWeight: 700 }}>
        {name}
      </Typography>
    </Paper>
  );
};

export const Skills = () => {
  const { skills } = useData();
  return (
    <div>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "start",
          gap: 2,
        }}
      >
        <ConstructionOutlinedIcon fontSize="large" sx={{ mt: "0.2rem" }} />
        <Typography variant="h4" component="h2">
          Technical Expertise
        </Typography>
      </Box>
      <Cards
        idKey="name"
        items={skills}
        animationName="skills"
        size={{ xs: 12, sm: 12, md: 6, xl: 4 }}
        renderCard={(item) => (
          <SkillCardItem name={item.name} logo={item.logo} />
        )}
      />
    </div>
  );
};
