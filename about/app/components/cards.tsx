"use client";
import {
  Paper,
  Grid,
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import {
  ComponentProps,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import clsx from "clsx";
import { get } from "lodash";
import { Tilt } from "./tilt";
import { useDetextTouchScreenOnly } from "../hooks/use-detect-touch-sceen-only";

type CardsProps<T> = {
  animationName: string;
  items: T[];
  idKey?: string;
  descriptionKey?: string;
  size?: ComponentProps<typeof Grid>["size"];
  renderCard: (item: T, isViewing: boolean) => ReactNode;
};

const Description = ({ value }: { value: string | string[] }) => {
  if (typeof value === "string") {
    return (
      <Typography variant="body1" component="p">
        {value}
      </Typography>
    );
  }

  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value.map((item, index) => (
      <Typography
        key={item}
        variant="body1"
        component="p"
        sx={{
          marginBottom: index < value.length - 1 ? 3 : undefined,
        }}
      >
        {item}
      </Typography>
    ));
  }

  return null;
};

export const Cards = <T,>({
  items,
  idKey = "id",
  descriptionKey = "description",
  animationName,
  size,
  renderCard,
}: CardsProps<T>) => {
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [transitionId, setTransitionId] = useState<string | null>(null);
  const isTouchScreen = useDetextTouchScreenOnly();

  const handleModalClose = useCallback(() => {
    const transition = document.startViewTransition(() => {
      setViewingId(null);
      setTransitionId(null);
    });

    transition.finished.finally(() => {
      document.body.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("overflow");
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleModalClose();
      }
    };

    if (viewingId) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("overflow");
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("overflow");
    };
  }, [viewingId, handleModalClose]);

  return (
    <div>
      <Grid container spacing={2}>
        {items.map((item, index) => {
          const id = get(item, idKey);
          const description = get(item, descriptionKey);
          const isViewing = viewingId === id;

          return (
            <Grid
              size={size}
              style={{ viewTransitionName: `${animationName}-${index}` }}
              key={id}
              className={clsx(isViewing && "viewing-card")}
              sx={{
                cursor: !isViewing ? "pointer" : undefined,
                zIndex: 0,
                ...(transitionId === id && { zIndex: 1002 }),
                "&:hover": {
                  zIndex: isTouchScreen ? 1002 : 1,
                },
                "&>.MuiPaper-root": {
                  boxShadow: (theme) => {
                    if (isViewing) return theme.shadows[10];
                    return theme.shadows[1];
                  },
                },
                "&:hover>.MuiPaper-root": {
                  boxShadow: (theme) => theme.shadows[10],
                },
                "&.viewing-card": {
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1002,
                  minWidth: "320px",
                  maxWidth: "100%",
                },
              }}
              onClick={() => {
                if (isViewing) return;
                setTransitionId(id);
                document.startViewTransition(() => {
                  setViewingId(id);
                  setTransitionId(null);
                });
              }}
            >
              <Tilt disabled={isViewing}>
                <Paper
                  className="sticky-scrollable-container"
                  sx={{
                    borderRadius: "0.8rem",
                    position: "relative",
                    maxHeight: "calc(100vh - 150px)",
                    overflow: "auto",
                  }}
                >
                  {isViewing && (
                    <Box
                      sx={{
                        position: "sticky",
                        top: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "end",
                        zIndex: 3,
                      }}
                    >
                      <Tooltip title="Close" disableInteractive>
                        <IconButton
                          onClick={handleModalClose}
                          sx={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                          }}
                        >
                          <CloseOutlined />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                  {renderCard(item, isViewing)}
                  <Box sx={{ px: 5, pt: 5, pb: 3 }}>
                    {isViewing ? (
                      <Description value={description} />
                    ) : (
                      <Typography
                        variant="body1"
                        component="p"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          marginBottom: 5,
                        }}
                      >
                        {description}
                      </Typography>
                    )}
                    {!isViewing && (
                      <Box sx={{ display: "flex", justifyContent: "end" }}>
                        <Button>Read more</Button>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Tilt>
            </Grid>
          );
        })}
      </Grid>
      <Box
        style={{ viewTransitionName: `backdrop-${animationName}` }}
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 1001,
          pointerEvents: viewingId ? "auto" : "none",
          opacity: viewingId ? 1 : 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        }}
        onClick={handleModalClose}
      />
    </div>
  );
};
