"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useInView, useScroll } from "framer-motion";
import {
  Paper,
  Box,
  Typography,
  Button,
  IconButton,
  Container,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useThemeToggle } from "../providers/theme-provider";
import { useWebGLImageWave } from "../hooks/use-wave-effect";
import { useData } from "../providers/data-provider";
import { Socials } from "../components/socials";
import { ProfileName } from "../components/profile-name";

export const Header = () => {
  const { profile } = useData();
  const { scrollY } = useScroll();
  const [scrolledPercentage, setScrolledPercentage] = useState(0);

  const { mode, toggleTheme } = useThemeToggle();
  const ref = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
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
  });

  useEffect(() => {
    const updateScrollRatio = (latest: number = scrollY.get()) => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        const ratio = latest / headerHeight;
        setScrolledPercentage(Math.min(1, ratio));
      }
    };

    const unsubscribe = scrollY.on("change", updateScrollRatio);

    updateScrollRatio();

    window.addEventListener("resize", () => updateScrollRatio());

    return () => {
      unsubscribe();
      window.removeEventListener("resize", () => updateScrollRatio());
    };
  }, [scrollY, headerRef]);

  return (
    <>
      <Paper
        sx={{
          position: "fixed",
          visibility: isInView ? "hidden" : "visible",
          top: 0,
          left: 0,
          width: "100vw",
          borderRadius: "unset",
          viewTransitionName: "app-bar",
          display: "flex",
          gap: 3,
          alignItems: "center",
          px: 3,
          py: 1,
          zIndex: 2000,
          transition: "transform 0.3s, visibility 0.3s",
          transform: `translateY(${isInView ? "-200%" : "0"})`,
          bgcolor: (theme) => theme.palette.background.paper,
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
            priority
            width={70}
            height={70}
            loading="eager"
          />
        </Box>
        <ProfileName
          TypographyProps={{
            variant: "h4",
            className: "mobile-hidden",
          }}
          SvgIconProps={{
            fontSize: "large",
          }}
        />
        <Box sx={{ display: "flex", gap: 3, ml: "auto" }}>
          <Socials path="profile.contacts" />
          <Button
            variant="contained"
            href={profile.contacts[0].link}
            className="mobile-hidden"
          >
            Get in touch
          </Button>
          <IconButton onClick={toggleTheme}>
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Paper>
      <Box
        component="header"
        role="banner"
        ref={headerRef}
        sx={{ position: "sticky", top: 0, pt: 3, pb: 3 }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1,
            backgroundColor: "rgba(0,0,0,0.9)",
          }}
          style={{
            opacity: scrolledPercentage.toFixed(2),
          }}
        />
        <Container>
          <Paper
            sx={{
              borderRadius: "0.8rem",
              overflow: "hidden",
            }}
            style={{
              transform: `scale(${1 - scrolledPercentage * (1 - 0.7)})`,
            }}
            elevation={1}
          >
            <Box sx={{ position: "relative" }}>
              <Box
                ref={waveContainerRef}
                sx={{ height: "200px", position: "relative" }}
              >
                <Image
                  ref={waveImageRef}
                  src={`/api/google-drive/${profile.background}`}
                  alt="cover"
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                  sizes="100vw"
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                />
              </Box>
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
              <h1 style={{ margin: 0 }}>
                <ProfileName
                  TypographyProps={{
                    variant: "h3",
                    sx: { mt: 3 },
                  }}
                  SvgIconProps={{
                    fontSize: "inherit",
                  }}
                />
                <Typography variant="h6" component="div">
                  {profile.title}
                </Typography>
              </h1>
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <LocationOnOutlinedIcon fontSize="inherit" color="inherit" />
                {profile.location}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  mt: 3,
                }}
              >
                <Button
                  variant="contained"
                  href={profile.contacts[0].link}
                  className="mobile-hidden"
                >
                  Get in touch
                </Button>
                <Socials path="profile.contacts" />
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
      <div ref={ref} />
    </>
  );
};
