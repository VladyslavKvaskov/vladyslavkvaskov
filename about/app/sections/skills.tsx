"use client";
import { useRef } from "react";
import { Typography, Box } from "@mui/material";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import { Cards } from "../components/cards";
import { useWebGLImageWave } from "../hooks/use-wave-effect";
import { useData } from "../providers/data-provider";
import { WaveImage } from "../components/wave-image";

const SkillCardItem = ({ name, logo }: { name: string; logo: string }) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useWebGLImageWave(containerRef, imageRef, {
    waveSpeed: 3.0,
    waveFrequency: 4.5,
    waveAmplitude: 5.0,
  });

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "start",
        mb: 3,
        width: "100%",
      }}
    >
      <WaveImage googleDriveImageID={logo} alt={`${name} logo`} />
      <Typography variant="h6" component="strong" sx={{ fontWeight: 700 }}>
        {name}
      </Typography>
    </Box>
  );
};

export const Skills = () => {
  const { skills } = useData();
  return (
    <div>
      <Typography
        variant="h4"
        sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}
      >
        <ConstructionOutlinedIcon fontSize="large" /> Technical Expertise
      </Typography>
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
