import { Box } from "@mui/material";
import Image from "next/image";
import { useRef } from "react";
import { useWebGLImageWave } from "../hooks/use-wave-effect";

export const WaveImage = ({
  alt,
  googleDriveImageID,
  width = 100,
  height = 100,
}: {
  alt: string;
  googleDriveImageID: string;
  width?: number;
  height?: number;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useWebGLImageWave(containerRef, imageRef, {
    waveSpeed: 3.0,
    waveFrequency: 4.5,
    waveAmplitude: 5.0,
  });

  return (
    <Box
      ref={containerRef}
      sx={{
        borderRadius: "0.8rem",
        display: "flex",
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
        width: width,
        height: height,
      }}
    >
      <Image
        ref={imageRef}
        src={`/api/google-drive/${googleDriveImageID}`}
        alt={alt}
        width={width}
        height={height}
        style={{ display: "block" }}
      />
    </Box>
  );
};
