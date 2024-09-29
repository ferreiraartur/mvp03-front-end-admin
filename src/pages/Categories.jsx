import { useEffect, useState,useRef } from "react"
import {Box, Paper, Button, TextField,FormControl,InputLabel, Input, Snackbar} from '@mui/material';
import axios from 'axios';
import Grid from '@mui/material/Grid2';
import {GridRowModes,DataGrid,GridToolbarContainer,GridActionsCellItem,GridRowEditStopReasons,} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

function EditToolbar(props) {
  const { setCategories, setRowModesModel,availableIds } = props;

  const handleClick = () => {
    const id = randomId();
    setCourses((oldCourses) => [
      ...oldCourses,
      { id, title: '', content: '',price: '', isNew: true },
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

function Categories() {

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [rowModesModel, setRowModesModel] = useState({});

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/categories')
      .then(res => setCategories(res.data.categories))
      .catch(error => console.log(error))
  }, [])

  const [categories, setCategories] = useState([])

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = categories.find((row) => row.id === id);
    if (editedRow.isNew) {
      setCategories(categories.filter((row) => row.id !== id));
    }
  };

  const handleProcessRowUpdate = async (newRow) => {
    console.log("passou aqui 123");
    try {
       

      const response = await axios.put(`http://localhost:5000/category?id=${newRow.id}`, newRow,{
        headers: {
            'Content-Type': 'multipart/form-data',
          },    


    });
      setSuccessMessage('Categoria atualizada com sucesso!');
      const updatedRows = categories.map((row) => (row.id === newRow.id ? response.data : row));
      setCategories(updatedRows);
    } catch (error) {
      console.error('Error updating Course:', error);
      setErrorMessage('Failed to update course.');
    }

    return newRow; // Return the updated row to refresh the grid
  };


  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleDeleteClick = (id) => () => {


    setCategories(categories.filter((row) => row.id !== id));
    axios.delete(`http://localhost:5000/category?id=${id}`)
    setSuccessMessage('Categoria deletada com sucesso!');
  };

  const handleDelete = async () => {
    //console.log("passou aqui!");
    //console.log("teste2",rowSelectionModel);
    //console.log("teste3",SelectedRows);
    
    try {
      await Promise.all(
        rowSelectionModel.map((rowSelectionModel) =>
          //console.log("teste",rowSelectionModel),
          console.log(`http://localhost:5000/categorie?id=${rowSelectionModel}`),
          axios.delete(`http://localhost:5000/categorie?id=${rowSelectionModel}`),
          
        )
      );
      
      
    } catch (error) {
      console.error("Error deleting items:", error);
      // Optionally, show a notification to the user
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verifica se o arquivo selecionado é nulo
    if (!selectedImage) {
      setErrorMessage('Por favor, selecione uma imagem para fazer o upload.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('file', selectedImage);
      
      const response = await axios.post('http://localhost:5000/category',formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },        


    });
      console.log('Response:', response.data);
      setSuccessMessage('Categoria cadastrada com sucesso!');
      setName('');
      setDescription('');
      setSelectedImage(null);
      fileInputRef.current.value = '';
      
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error appropriately
    }
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200, editable: true},
    { field: 'description', headerName: 'Description', width: 600, editable: true },
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
                  label="Description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></TextField>
                 <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    inputRef={fileInputRef}
                  />

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
            rows={categories}            
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
                toolbar: { setCategories, setRowModesModel },
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

export default Categories