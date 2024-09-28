import { useEffect, useState,useRef } from "react"
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import {Box, Button, TextField,FormControl,InputLabel, Input, Snackbar} from '@mui/material';
import Grid from '@mui/material/Grid2';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import {GridRowModes,DataGrid,GridToolbarContainer,GridActionsCellItem,GridRowEditStopReasons,} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
//import './App.css'

function EditToolbar(props) {
  const { setCourses, setRowModesModel,availableIds } = props;

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


function Courses() {

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/courses')
      .then(res => setCourseList(res.data.courses))
      .catch(error => console.log(error))
  }, [])

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState('');

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [courseList, setCourseList] = useState([])
  const [deletedRows, setDeletedRows] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [SelectedRows, setgetSelectedRows] = useState([]);
  const [rows, setRows] = useState([]);
  const fileInputRef = useRef(null);
  const [rowModesModel, setRowModesModel] = useState({});


  

  const handleTeste = () => {
    
    location.reload();
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('price', price);
      //formData.append('imageURL', imageURL);
      formData.append('file', selectedImage);
      
      const response = await axios.post('http://localhost:5000/course',formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },        


    });
      console.log('Response:', response.data);
      setSuccessMessage('Curso cadastrado com sucesso!');
      setTitle('');
      setContent('');
      setPrice('');
      //setImageURL('');
      setSelectedImage(null);
      fileInputRef.current.value = '';
      
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error appropriately
    }
  }



  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      setSelectedImage(file);
    }
  };
  
  const handleDelete = async () => {
    console.log("passou aqui!");
    console.log("teste2",rowSelectionModel);
    console.log("teste3",SelectedRows);
    
    try {
      await Promise.all(
        rowSelectionModel.map((rowSelectionModel) =>
          console.log("teste",rowSelectionModel),
          console.log(`http://localhost:5000/course?id=${rowSelectionModel}`),
          axios.delete(`http://localhost:5000/course?id=${rowSelectionModel}`),
          
        )
      );
      
      
    } catch (error) {
      console.error("Error deleting items:", error);
      // Optionally, show a notification to the user
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleProcessRowUpdate = async (newRow) => {
    console.log("passou aqui 123");
    try {
       

      const response = await axios.put(`http://localhost:5000/course?id=${newRow.id}`, newRow,{
        headers: {
            'Content-Type': 'multipart/form-data',
          },    


    });
      setSuccessMessage('Course updated successfully!');
      const updatedRows = courseList.map((row) => (row.id === newRow.id ? response.data : row));
      setCourseList(updatedRows);
    } catch (error) {
      console.error('Error updating Course:', error);
      setErrorMessage('Failed to update course.');
    }

    return newRow; // Return the updated row to refresh the grid
  };


  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = courseList.find((row) => row.id === id);
    if (editedRow.isNew) {
      setCourseList(courseList.filter((row) => row.id !== id));
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };


  const handleDeleteClick = (id) => () => {


    setCourseList(courseList.filter((row) => row.id !== id));
    axios.delete(`http://localhost:5000/course?id=${id}`)
    setSuccessMessage('Curso deletado com sucesso!');
  };
 

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', width: 130, editable: true },
    { field: 'content', headerName: 'Content', width: 130, editable: true },
    { field: 'price', headerName: 'Price', width: 130, editable: true },

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
                  label="Title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                ></TextField>

                <TextField
                  label="Conteúdo"
                  name="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                ></TextField>

                <TextField
                  label="Preço"
                  name="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                ></TextField>

                {/*
                <TextField
                  label="imageURL"
                  name="imageURL"
                  value={imageURL}
                  onChange={(e) => setImageURL(e.target.value)}
                  required
                ></TextField>
                */}

                
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
            
              <Grid >
                <Button
                  variant="contained" 
                  color="primary" 
                  onClick={handleTeste}
                  sx={{ marginBottom: 2 }}
                >
                  Atualizar
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
            rows={courseList}            
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
                toolbar: { setCourseList, setRowModesModel },
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

        {/*<Typography variant="h1" component="h2">
                  Lista de Cursos
        </Typography>*/}
        

      </div>
      
    
      
    
  )
}

export default Courses
