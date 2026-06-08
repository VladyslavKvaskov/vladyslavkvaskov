"use client";
import { Container, Box } from "@mui/material";
import { Experience } from "./sections/experience";
import { Skills } from "./sections/skills";
import { Header } from "./sections/header";
import { Languages } from "./sections/languages";
import { Footer } from "./sections/footer";

const About = () => {
  return (
    <>
      <Header />
      <Box
        component="main"
        role="main"
        sx={{
          position: "relative",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          zIndex: 1,
          pb: 10,
          background: (theme) => theme.palette.background.default,
        }}
      >
        <Container
          sx={{
            display: "flex",
            gap: 7,
            flexDirection: "column",
            pt: 3,
          }}
        >
          <Experience />
          <Skills />
          <Languages />
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default About;
