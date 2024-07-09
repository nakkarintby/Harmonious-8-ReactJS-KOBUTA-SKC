import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import { SxProps } from '@mui/system';

const commonStyles: SxProps = {
  boxShadow: 2,
  border: 2,
  borderColor: 'primary.light',
  width: '100%',
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: '#19857B',
    width: '100%', // Ensures column headers expand to full width
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    color: '#FFFFFF', // Changes header text color to white
    fontWeight: 'bold', // Makes header text bold
  },
  '& .MuiDataGrid-cell:hover': {
    color: 'primary.main',
  },
};

export default function StyledDataGrid(props: DataGridProps) {
  return <DataGrid sx={commonStyles} {...props} />;
}
