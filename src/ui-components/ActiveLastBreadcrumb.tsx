import { Box, Breadcrumbs, Link } from '@mui/material';

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
          <Link
            underline="hover"
            color="inherit"
            href={''}
          >
            {prm1}
          </Link>
          <Link
            underline="hover"
            color="text.primary"
            href={'/' + formatString(prm1) + '/' + formatString(prm2)}
            aria-current="page"
          >
            {prm2}
          </Link>
          <Link
            underline="hover"
            color="text.primary"
            href={'/' + formatString(prm1) + '/' + formatString(prm2) + '/' + formatString(prm3)}
            aria-current="page"
          >
            {prm3}
          </Link>
        </Breadcrumbs>
      </div>
      <div>
        <br />
      </div>
    </Box>
  );
}