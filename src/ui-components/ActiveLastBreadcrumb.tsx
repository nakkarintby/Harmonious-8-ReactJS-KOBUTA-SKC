import { Box, Breadcrumbs, Link, Typography } from '@mui/material';

export default function ActiveLastBreadcrumb({
  prm1,
  prm2,
  prm3,
}: {
  prm1: string;
  prm2: string;
  prm3: string;
}) {
  const formatString = (str: string) => str.replace(/\s+/g, '').trim().toLowerCase();
  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
        <Typography
            color="inherit"
            aria-current="page"
          >
            {prm1}
          </Typography>
          <Link
            underline="hover"
            color="text.primary"
            href={"/" + formatString(prm1) + "/" + formatString(prm2)}
            aria-current="page"
          >
            {prm2}
          </Link>
          <Typography
            color="text.primary"
            aria-current="page"
          >
            {prm3}
          </Typography>
        </Breadcrumbs>
      </div>
      <div>
        <br />
      </div>
    </Box>
  );
}