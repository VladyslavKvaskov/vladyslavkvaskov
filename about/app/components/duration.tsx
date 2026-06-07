import { Typography } from "@mui/material";
import { differenceInMonths, differenceInYears } from "date-fns";

const getDuration = (
  start: Date | number | string,
  end: Date | number | string,
) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return { years: 0, months: 0 };
  }

  const years = differenceInYears(endDate, startDate);
  const months = differenceInMonths(endDate, startDate) - years * 12;

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
