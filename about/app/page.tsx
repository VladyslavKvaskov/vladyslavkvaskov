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
      <Container sx={{ position: "relative", mb: 10 }}>
        <Box sx={{ display: "flex", gap: 7, flexDirection: "column", mt: 3 }}>
          <Header />
          <Box
            component="main"
            role="main"
            sx={{ display: "flex", gap: 7, flexDirection: "column" }}
          >
            <Experience />
            <Skills />
            <Languages />
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default About;
