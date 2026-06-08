import { Box, IconButton, IconButtonOwnProps, Tooltip } from "@mui/material";
import { useData } from "../providers/data-provider";
import { GitHub, LinkedIn, Telegram, WhatsApp } from "@mui/icons-material";
import { AppName } from "@/enums";
import { Viber } from "../icons/viber";
import { get } from "lodash";

const renderIcon = (appName: AppName) => {
  switch (appName) {
    case AppName.WhatsApp:
      return <WhatsApp />;
    case AppName.Telegram:
      return <Telegram />;
    case AppName.Viber:
      return <Viber />;
    case AppName.GitHub:
      return <GitHub />;
    case AppName.LinkedIn:
      return <LinkedIn />;
    default:
      return null;
  }
};

const getColor = (appName: AppName): IconButtonOwnProps["color"] => {
  switch (appName) {
    case AppName.WhatsApp:
      return "success";
    case AppName.Telegram:
      return "info";
    case AppName.LinkedIn:
      return "primary";
    case AppName.Viber:
      return "secondary";
    case AppName.GitHub:
      return "default";
    default:
      return undefined;
  }
};

export const Socials = ({ path }: { path: string }) => {
  const data = useData();

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      {get(data, path).map(
        ({ name, link }: { name: AppName; link: string }) => (
          <IconButton
            key={name}
            href={link}
            sx={(theme) => ({
              overflow: "hidden",
              transition: "box-shadow 0.3s, max-width 0.5s",
              willChange: "max-width",
              borderRadius: "2rem",
              boxShadow: theme.shadows[1],
              fontSize: "1rem",
              maxWidth: "40px",
              justifyContent: "start",
              gap: 1,
              "&:hover": {
                boxShadow: theme.shadows[3],
                maxWidth: "200px",
              },
            })}
            color={getColor(name)}
          >
            {renderIcon(name)} {name}
          </IconButton>
        ),
      )}
    </Box>
  );
};
