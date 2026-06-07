import { Typography } from "@mui/material";

const getDuration = (
  start: Date | number | string,
  end: Date | number | string,
) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (endDate.getDate() < startDate.getDate()) {
    months--;
    if (months < 0) {
      months = 11;
      years--;
    }
  }

  return { years, months };
};

export const Duration = ({
  start,
  end,
}: {
  start: Date | number | string;
  end: Date | number | string;
}) => {
  const { years, months } = getDuration(start, end);

  if (!years && !months) {
    return null;
  }

  return (
    <Typography variant="body2" component="div" color="textSecondary">
      ({years > 0 && `${years} year${years > 1 ? "s" : ""}`}
      {years > 0 && months > 0 && " "}
      {months > 0 && `${months} month${months > 1 ? "s" : ""}`})
    </Typography>
  );
};
