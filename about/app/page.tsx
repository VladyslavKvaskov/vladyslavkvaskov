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
      <Container sx={{ position: "relative" }}>
        <Box sx={{ display: "flex", gap: 7, flexDirection: "column", mt: 3 }}>
          <Header />
          <Experience />
          <Skills />
          <Languages />
          <Footer />
        </Box>
      </Container>
    </>
  );
};

export default About;
