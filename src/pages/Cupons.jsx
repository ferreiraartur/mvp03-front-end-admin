import { useEffect, useState,useRef } from "react"
import {Box, Paper, Button, TextField,FormControl,InputLabel, Input, Snackbar, FormControlLabel, FormLabel, RadioGroup, Radio} from '@mui/material';
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
    const { setCupons, setRowModesModel,availableIds } = props;
  
    const handleClick = () => {
      const id = randomId();
      setCupons((oldCupons) => [
        ...oldCupons,
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

function Cupons() {

  const [name, setName] = useState('');
  const [discount, setDiscount] = useState('');
  const [valid, setValid] = useState('');
  
  
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cupons, setCupons] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [SelectedRows, setgetSelectedRows] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/cupons')
      .then(res => setCupons(res.data.cupons))
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


    setCupons(cupons.filter((row) => row.id !== id));
    axios.delete(`http://localhost:5000/cupom?id=${id}`)
    setSuccessMessage('Cupom deletada com sucesso!');
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = cupons.find((row) => row.id === id);
    if (editedRow.isNew) {
      setCupons(cupons.filter((row) => row.id !== id));
    }
  };

 

  const handleProcessRowUpdate = async (newRow) => {
    console.log("passou aqui 123");
    try {
       

      const response = await axios.put(`http://localhost:5000/cupom?id=${newRow.id}`, newRow,{
        headers: {
            'Content-Type': 'multipart/form-data',
          },    


    });
      setSuccessMessage('Cupom updated successfully!');
      const updatedRows = cupons.map((row) => (row.id === newRow.id ? response.data : row));
      setCupons(updatedRows);
    } catch (error) {
      console.error('Error updating Cupom:', error);
      setErrorMessage('Failed to update cupom.');
    }

    return newRow; // Return the updated row to refresh the grid
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('discount', discount);
      formData.append('valid', valid);
      
      
      const response = await axios.post('http://localhost:5000/cupom',formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },        


    });
      console.log('Response:', response.data);
      setSuccessMessage('Registrado com Sucesso!');
      setName('');
      setDiscount('');

      // Atualizar a lista de cupons
      setCupons((prevCupons) => {
        return [...prevCupons, response.data]; 
      });
      

      
      
      
      
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

 

  const handleValidChange = (id, value) => {
    setCupons((prev) =>
      prev.map((row) => (row.id === id ? { ...row, valid: value } : row))
    );
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 130, editable: true},
    { field: 'discount', headerName: 'Desconto', width: 200, editable: true },
    {
      field: 'valid',
      headerName: 'Status',
      width: 300,
      renderCell: (params) => {
        const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;

        return isInEditMode ? (
          <div>
            <FormControlLabel
              control={
                <Radio
                  checked={params.value === 'true'}
                  onChange={() => handleValidChange(params.id, 'true')}
                />
              }
              label="Ativado"
            />
            <FormControlLabel
              control={
                <Radio
                  checked={params.value === 'false'}
                  onChange={() => handleValidChange(params.id, 'false')}
                />
              }
              label="Desativado"
            />
          </div>
        ) : (
          //console.log ({params}.value)
          //<span>{params}</span>
          <span> {params.row.valid ? 'Ativado' : 'Desativado'} {console.log('Valid Value:', params.row.valid)}</span>
          

          
        );
      },
    }


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

              
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="true"
                name="radio-buttons-group"
                value={valid} 
                onChange={(e) => setValid(e.target.value)}
              >
                <FormControlLabel value="true" control={<Radio />} label="Ativado" />
                <FormControlLabel value="false" control={<Radio />} label="Desativado" />
                
              </RadioGroup>
                 

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
            
            rows={cupons}            
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={handleProcessRowUpdate}
            slots={{
                toolbar: EditToolbar,
            }}
            slotProps={{
                toolbar: { setCupons, setRowModesModel },
            }}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            disableRowSelectionOnClick
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

export default Cupons