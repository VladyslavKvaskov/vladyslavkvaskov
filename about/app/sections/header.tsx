"use client";
import { useRef } from "react";
import Image from "next/image";
import { useInView } from "framer-motion";
import { Paper, Box, Typography, Button, IconButton } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useThemeToggle } from "../providers/theme-provider";
import { useWebGLImageWave } from "../hooks/use-wave-effect";
import { useData } from "../providers/data-provider";
import { isMobile } from "react-device-detect";

export const Header = () => {
  const { profile } = useData();
  const { mode, toggleTheme } = useThemeToggle();
  const ref = useRef<HTMLDivElement | null>(null);
  const waveContainerRef = useRef<HTMLDivElement | null>(null);
  const waveImageRef = useRef<HTMLImageElement | null>(null);
  const isInView = useInView(ref, {
    margin: "0px",
    once: false,
    initial: true,
  });

  useWebGLImageWave(waveContainerRef, waveImageRef, {
    waveSpeed: 3.0,
    waveFrequency: 4.5,
    waveAmplitude: 10.0,
    alwaysAnimate: true,
  });

  return (
    <div ref={ref}>
      <Paper
        sx={{
          position: "fixed",
          visibility: isInView ? "hidden" : "visible",
          top: 0,
          left: 0,
          zIndex: isMobile ? 500 : 2000,
          width: "100vw",
          borderRadius: "unset",
          viewTransitionName: "app-bar",
          display: "flex",
          gap: 3,
          alignItems: "center",
          px: 3,
          py: 1,
          transition: "transform 0.3s, visibility 0.3s",
          transform: `translateY(${isInView ? "-200%" : "0"})`,
        }}
        elevation={3}
      >
        <Box
          className="fixed-header-avatar"
          sx={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          <Image
            src={`/api/google-drive/${profile.avatar}`}
            alt="cover"
            className="w-full object-cover"
            style={{
              width: 70,
              height: 70,
            }}
            width={70}
            height={70}
            loading="eager"
          />
        </Box>
        <Typography
          variant="h4"
          className="mobile-hidden"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          {profile.name} <VerifiedIcon fontSize="medium" color="primary" />
        </Typography>
        <Box sx={{ display: "flex", gap: 3, ml: "auto" }}>
          <Button variant="contained" href={profile.hireLink}>
            Get in touch
          </Button>
          <IconButton onClick={toggleTheme}>
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Paper>
      <Paper
        className="wave-effect-trigger"
        sx={{
          borderRadius: "0.8rem",
          overflow: "hidden",
          viewTransitionName: "header",
        }}
        elevation={1}
      >
        <Box sx={{ position: "relative" }}>
          <div ref={waveContainerRef}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={waveImageRef}
              src={`/api/google-drive/${profile.background}`}
              alt="cover"
              style={{
                height: 200,
                width: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <Box
            sx={(theme) => ({
              width: 160,
              height: 160,
              border: `5px solid ${theme.palette.mode === "light" ? "#fff" : "#1e1e1e"}`,
              borderRadius: "50%",
              overflow: "hidden",
              position: "absolute",
              bottom: 0,
              left: 0,
              transform: "translate(30px, 50%)",
            })}
          >
            <Image
              src={`/api/google-drive/${profile.avatar}`}
              alt="cover"
              className="w-full object-cover"
              width={160}
              height={160}
              loading="eager"
            />
          </Box>
        </Box>
        <Box sx={{ p: 5, mt: 5 }}>
          <Typography
            variant="h3"
            sx={{ mt: 3, display: "flex", alignItems: "center", gap: 1 }}
          >
            {profile.name} <VerifiedIcon fontSize="large" color="primary" />
          </Typography>
          <Typography variant="h6">{profile.title}</Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <LocationOnOutlinedIcon fontSize="inherit" color="inherit" />
            {profile.location}
          </Typography>
          <Button variant="contained" sx={{ mt: 3 }} href={profile.hireLink}>
            Get in touch
          </Button>
        </Box>
      </Paper>
    </div>
  );
};
