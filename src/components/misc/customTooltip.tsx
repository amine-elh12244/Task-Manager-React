import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import { tooltipClasses } from "@mui/material/Tooltip";
import type { TooltipProps } from "@mui/material/Tooltip";
import {Typography } from '@mui/material';

export const CustomTooltip = styled(({ className, title, ...props }: TooltipProps) => (
  <Tooltip title={title} classes={{ popper: className }}>
    <Typography
      sx={{
        whiteSpace: 'pre-wrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: '1',
        WebkitBoxOrient: 'vertical',
      }}
    >
      {title}
    </Typography>
  </Tooltip>
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 12,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
  },
}));
