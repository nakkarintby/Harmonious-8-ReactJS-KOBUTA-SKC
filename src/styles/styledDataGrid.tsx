import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import { SxProps } from '@mui/system';

const commonStyles: SxProps = {
  boxShadow: 2,
  border: 2,
  borderColor: 'primary.light',
  width: '100%',
  maxHeight: '30vw',
  height: '30vw',
  overflow: 'auto',
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: '#19857B',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  '& .MuiDataGrid-cell:hover': {
    color: 'primary.main',
  },
  '& .NG' :{
    backgroundColor: 'lightcoral',
  }
};

export default function StyledDataGrid(props: DataGridProps) {
  
  return <DataGrid sx={commonStyles} {...props} />;
}
