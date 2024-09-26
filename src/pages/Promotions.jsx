import { useEffect, useState,useRef } from "react"
import {Box, Paper, Button, TextField,FormControl,InputLabel, Input, Snackbar} from '@mui/material';
import axios from 'axios';
import Grid from '@mui/material/Grid2';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {GridRowModes,DataGrid,GridToolbarContainer,GridActionsCellItem,GridRowEditStopReasons,} from '@mui/x-data-grid';
//import {randomId} from '@mui/x-data-grid-generator';

function EditToolbar(props) {
    const { setPromotions, setRowModesModel,availableIds } = props;
  
    const handleClick = () => {
      const id = randomId();
      setPromotions((oldPromotions) => [
        ...oldPromotions,
        { id, name: '', discount: '', isNew: true },
      ]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      }));
    };
  
    return (
      <GridToolbarContainer>
       {/* <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add record
        </Button>*/}
      </GridToolbarContainer>
    );
  }

function Promotions() {

  const [name, setName] = useState('');
  const [discount, setDiscount] = useState('');
  
  
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [promotions, setPromotions] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  const [SelectedRows, setgetSelectedRows] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/promotions')
      .then(res => setPromotions(res.data.promotions))
      .catch(error => console.log(error))
  }, [])

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {


    setPromotions(promotions.filter((row) => row.id !== id));
    axios.delete(`http://localhost:5000/promotion?id=${id}`)
    setSuccessMessage('Promoção deletada com sucesso!');
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = promotions.find((row) => row.id === id);
    if (editedRow.isNew) {
      setPromotions(promotions.filter((row) => row.id !== id));
    }
  };

 

  const handleProcessRowUpdate = async (newRow) => {
    console.log("passou aqui 123");
    try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('discount', discount);

      const response = await axios.put(`http://localhost:5000/promotion?id=${newRow.id}`, newRow,{
        headers: {
            'Content-Type': 'multipart/form-data',
          },    


    });
      setSuccessMessage('Promotion updated successfully!');
      const updatedRows = promotions.map((row) => (row.id === newRow.id ? response.data : row));
      setPromotions(updatedRows);
    } catch (error) {
      console.error('Error updating Promotion:', error);
      setErrorMessage('Failed to update promotion.');
    }

    return newRow; // Return the updated row to refresh the grid
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('discount', discount);
      
      
      const response = await axios.post('http://localhost:5000/promotion',formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },        


    });
      console.log('Response:', response.data);
      setSuccessMessage('Registrado com Sucesso!');
      setName('');
      setDiscount('');
      
      
      
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error appropriately
    }
  }

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 130, editable: true},
    { field: 'discount', headerName: 'discount', width: 130, editable: true },
    ,
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  
   
    
  ];

  const paginationModel = { page: 0, pageSize: 5 };
 

  return (
      
      <div>
        <Paper>
          <Box sx={{ maxWidth: 400, margin: 'auto' }}>
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                ></TextField>

                <TextField
                  label="Discount"
                  name="discount"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  required
                ></TextField>
                 

              </FormControl>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </form>
          </Box>
        </Paper>

        <Paper>
          <Box sx={{ height: 600, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
              <Grid container spacing={4}>
                
            
              <Grid size={2}>
                <Snackbar
                  open={!!successMessage}
                  autoHideDuration={6000}
                  onClose={handleCloseSnackbar}
                  message={successMessage}
                />
                <Snackbar
                  open={!!errorMessage}
                  autoHideDuration={6000}
                  onClose={handleCloseSnackbar}
                  message={errorMessage}
                />
              </Grid>

            </Grid>
           
            
          </Box>
          
          <DataGrid
            //onCellEditStop={handleProcessRowUpdate}
            rows={promotions}            
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={handleProcessRowUpdate}
            //onProcessRowUpdateError={handleProcessRowUpdateError}
            slots={{
                toolbar: EditToolbar,
            }}
            slotProps={{
                toolbar: { setPromotions, setRowModesModel },
            }}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            //checkboxSelection
            disableRowSelectionOnClick
            //onSelectionModelChange={({selectionModel}) => {
             // const rowIds = selectionModel.map(rowId => parseInt(String(rowId), 10));
             // const rowsToDelete = rows.filter(row => rowIds.includes(row.id));
             // setDeletedRows(rowsToDelete);
            //}}
            //onRowSelectionModelChange={(newRowSelectionModel) => {
            //  setRowSelectionModel(newRowSelectionModel);
            //}}
            //rowSelectionModel={rowSelectionModel}
            sx={{ border: 0 }}         
          
          />
          <Snackbar
            open={!!successMessage}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            message={successMessage}
          />
          <Snackbar
            open={!!errorMessage}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            message={errorMessage}
          />
        </Box>
        </Paper>
        

      </div>
      
    
      
    
  )
}

export default Promotions