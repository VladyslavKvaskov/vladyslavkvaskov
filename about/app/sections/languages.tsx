import { Grid, LinearProgress, Paper, Typography } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useData } from "../providers/data-provider";

export const Languages = () => {
  const { languages } = useData();

  return (
    <div>
      <Typography
        variant="h4"
        component="h2"
        sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}
      >
        <LanguageIcon fontSize="large" /> Languages
      </Typography>
      <Grid container spacing={2}>
        {languages?.map(({ title, progress, description }) => (
          <Grid key={title} size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper sx={{ borderRadius: "0.8rem", p: 5 }} elevation={1}>
              <Typography
                variant="h6"
                component="strong"
                sx={{ fontWeight: 700 }}
              >
                {title}
              </Typography>
              <LinearProgress
                sx={{ mb: 3 }}
                variant="determinate"
                value={progress}
                aria-label={`${title} progress`}
              />
              <Typography variant="body1" component="p">
                {description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
