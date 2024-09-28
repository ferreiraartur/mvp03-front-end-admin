import { useEffect, useState,useRef } from "react"
import {Box, Paper, Button, TextField,FormControl,InputLabel, Input, Snackbar} from '@mui/material';
import axios from 'axios';
import Grid from '@mui/material/Grid2';
import { DataGrid } from '@mui/x-data-grid';

function Categories() {

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/categories')
      .then(res => setCategories(res.data.categories))
      .catch(error => console.log(error))
  }, [])

  const [Categories, setCategories] = useState([])

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleProcessRowUpdate = async (newRow) => {
    console.log("passou aqui 123");
    try {
      const response = await axios.put(`http://localhost:5000/categorie/${newRow.id}`, newRow);
      setSuccessMessage('Categorie updated successfully!');
      const updatedRows = rows.map((row) => (row.id === newRow.id ? response.data : row));
      setRows(updatedRows);
    } catch (error) {
      console.error('Error updating Categorie:', error);
      setErrorMessage('Failed to update categorie.');
    }

    return newRow; // Return the updated row to refresh the grid
  };

  const handleDelete = async () => {
    console.log("passou aqui!");
    console.log("teste2",rowSelectionModel);
    console.log("teste3",SelectedRows);
    
    try {
      await Promise.all(
        rowSelectionModel.map((rowSelectionModel) =>
          console.log("teste",rowSelectionModel),
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
    { field: 'name', headerName: 'Name', width: 200},
    { field: 'description', headerName: 'Description', width: 600 },
   
    
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
                <Grid >
                  <Button
                    variant="contained" 
                    color="error" 
                    onClick={handleDelete}
                  disabled={rowSelectionModel.length === 0}
                  sx={{ marginBottom: 2 }}
                >
                  Excluir
                </Button>
              </Grid>
            
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
            onCellEditStop={handleProcessRowUpdate}
            rows={Categories}            
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            disableRowSelectionOnClick
            onSelectionModelChange={({selectionModel}) => {
              const rowIds = selectionModel.map(rowId => parseInt(String(rowId), 10));
              const rowsToDelete = rows.filter(row => rowIds.includes(row.id));
              setDeletedRows(rowsToDelete);
            }}
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
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