// src/pages/PetProfile.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';

import petService from '../services/petService';
import MedicalRecordItem from '../pages/PetProfile/MedicalRecordItem';
import AddRecordDialog from '../pages/PetProfile/AddRecordDialog';
import EditRecordDialog from '../pages/PetProfile/EditRecordDialog';

import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  IconButton,
  TextField,
  Button,
} from '@mui/material';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import BottomNav from '../components/BottomNav';

const PetProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [newRecord, setNewRecord] = useState({ type: '', file: null });
  const [editRecord, setEditRecord] = useState(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [editIsCameraActive, setEditIsCameraActive] = useState(false);
  const [editCapturedImage, setEditCapturedImage] = useState(null);

  const [cameraStream, setCameraStream] = useState(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [newOwnerEmail, setNewOwnerEmail] = useState('');

  const fetchPetDetails = async () => {
    console.log('📞 fetchPetDetails CALLED');

    const token = localStorage.getItem('token');
    console.log('🔐 Token in fetchPetDetails:', token);

    if (!token) {
      console.warn('🚨 No token found, aborting');
      setError('Authentication required');
      setLoading(false);
      return;
    }

    try {
      const petResponse = await axios.get(`http://localhost:3000/pets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('🐶 Pet Response:', petResponse.data);
      setPet(petResponse.data);

      const recordsResponse = await axios.get(`http://localhost:3000/medical-records/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('📋 Medical Records:', recordsResponse.data);
      setMedicalRecords(recordsResponse.data);
    } catch (err) {
      console.error('❌ Error in fetchPetDetails:', err);
      if (err.response) {
        console.error('📛 Backend error:', err.response.data);
      } else {
        console.error('🧨 Generic error:', err.message);
      }
      setError('Failed to load pet details');
    } finally {
      console.log('✅ Setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('📦 useEffect triggered for id:', id);
    fetchPetDetails();
  }, [id]);

  const handleFileChange = (e) => {
    setNewRecord({ ...newRecord, file: e.target.files[0] });
  };

  const handleRecordSubmit = async () => {
    const formData = new FormData();
    formData.append('type', newRecord.type);
    formData.append('file', newRecord.file);
    formData.append('pet_id', id);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/medical-records', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setOpen(false);
      fetchPetDetails();
    } catch {
      alert('Failed to add record');
    }
  };

  const handleStartCamera = async () => {
    try {
      const constraints = {
        video: { facingMode: isFrontCamera ? 'user' : 'environment' },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      document.getElementById('camera').srcObject = stream;
      setCameraStream(stream);
    } catch {
      setIsCameraActive(false);
    }
  };

  const handleCaptureImage = () => {
    const video = document.getElementById('camera');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0);
    const imageDataUrl = canvas.toDataURL('image/png');
    setCapturedImage(imageDataUrl);
    setIsCameraActive(false);
  };

  const handleConvertToPdf = async () => {
    const pdf = new jsPDF();
    pdf.addImage(capturedImage, 'PNG', 10, 10, 190, 280);
    const pdfBlob = pdf.output('blob');

    const formData = new FormData();
    formData.append('type', 'Scanned Document');
    formData.append('file', pdfBlob, 'scanned_document.pdf');
    formData.append('pet_id', id);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/medical-records', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCapturedImage(null);
      fetchPetDetails();
    } catch {
      alert('Failed to save scanned doc');
    }
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    setEditDialogOpen(true);
  };

  const handleEditCaptureImage = () => {
    const video = document.getElementById('edit-camera');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0);
    setEditCapturedImage(canvas.toDataURL('image/png'));
    setEditIsCameraActive(false);
  };

  const handleEditConvertToPdf = () => {
    const pdf = new jsPDF();
    pdf.addImage(editCapturedImage, 'PNG', 10, 10, 190, 280);
    const blob = pdf.output('blob');
    setEditRecord({ ...editRecord, file: blob });
  };

  const handleEditSubmit = async () => {
    const formData = new FormData();
    formData.append('type', editRecord.type);
    if (editRecord.file) formData.append('file', editRecord.file);

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/medical-records/${editRecord.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditDialogOpen(false);
      fetchPetDetails();
    } catch {
      alert('Failed to update record');
    }
  };

  const handleDelete = async (recordId) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/medical-records/${recordId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPetDetails();
    } catch {
      alert('Delete failed');
    }
  };

  const handleTransferOwnership = async () => {
    try {
      await petService.transferPetOwnership(id, newOwnerEmail);
      alert('Ownership transferred!');
    } catch (err) {
      alert(err.response?.data?.error || 'Transfer failed');
    }
  };

  console.log('⏳ [Render] Is loading?', loading);
  console.log('❗ [Render] Error?', error);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error" align="center" sx={{ mt: 4 }}>{error}</Typography>;
  }

  return (
    <Box sx={{ pb: 7, backgroundColor: '#f8f8f8', minHeight: '100vh' }}>
      <Container sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => navigate('/pets')}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 1 }}>
            Pet Profile
          </Typography>
        </Box>

        <Card>
          {pet?.photo_url && (
            <CardMedia
              component="img"
              height="300"
              image={`http://localhost:3000${pet.photo_url}`}
              alt={pet?.name || 'Pet photo'}
            />
          )}
          <CardContent>
            <Typography variant="h4">{pet?.name || 'Unnamed Pet'}</Typography>
            <Typography variant="body1">Breed: {pet?.breed || 'Unknown'}</Typography>
            <Typography variant="body2">
              Birthday: {pet?.birthday ? new Date(pet.birthday).toDateString() : 'Not provided'}
            </Typography>

            <Typography variant="h6" sx={{ mt: 3 }}>Medical Records:</Typography>
            {medicalRecords.length ? (
              medicalRecords.map((record) => (
                <MedicalRecordItem
                  key={record.id}
                  record={record}
                  onClick={() => setSelectedRecordId(record.id)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  selected={selectedRecordId === record.id}
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No medical records found.
              </Typography>
            )}
          </CardContent>
        </Card>

        <Box sx={{ mt: 3 }}>
          <TextField
            label="New Owner Email"
            fullWidth
            value={newOwnerEmail}
            onChange={(e) => setNewOwnerEmail(e.target.value)}
          />
          <Button variant="contained" onClick={handleTransferOwnership} sx={{ mt: 2 }}>
            Transfer Ownership
          </Button>
        </Box>
      </Container>

      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          backgroundColor: '#ccc',
          color: '#fff',
          '&:hover': { backgroundColor: '#bbb' },
        }}
      >
        <AddCircleOutlineIcon sx={{ fontSize: 50 }} />
      </IconButton>

      <BottomNav />

      <AddRecordDialog
        open={open}
        onClose={() => setOpen(false)}
        newRecord={newRecord}
        setNewRecord={setNewRecord}
        handleFileChange={handleFileChange}
        handleStartCamera={handleStartCamera}
        isCameraActive={isCameraActive}
        cameraStream={cameraStream}
        handleCaptureImage={handleCaptureImage}
        handleCloseCamera={() => setIsCameraActive(false)}
        capturedImage={capturedImage}
        handleConvertToPdf={handleConvertToPdf}
      />

      <EditRecordDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        editRecord={editRecord}
        setEditRecord={setEditRecord}
        isCameraActive={editIsCameraActive}
        setIsCameraActive={setEditIsCameraActive}
        handleCaptureImage={handleEditCaptureImage}
        capturedImage={editCapturedImage}
        handleConvertToPdf={handleEditConvertToPdf}
        handleSubmit={handleEditSubmit}
      />
    </Box>
  );
};

export default PetProfile;

// // src/pages/PetProfile.js
// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { jsPDF } from 'jspdf';

// import petService from '../services/petService';
// import MedicalRecordItem from '../pages/PetProfile/MedicalRecordItem';
// import AddRecordDialog from '../pages/PetProfile/AddRecordDialog';
// import EditRecordDialog from '../pages/PetProfile/EditRecordDialog';

// import {
//   Container,
//   Typography,
//   Box,
//   Card,
//   CardContent,
//   CardMedia,
//   CircularProgress,
//   IconButton,
//   TextField,
//   Button,
// } from '@mui/material';

// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

// import BottomNav from '../components/BottomNav'; // ✅ shared navigation

// const PetProfile = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [pet, setPet] = useState(null);
//   const [medicalRecords, setMedicalRecords] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [open, setOpen] = useState(false);
//   const [editDialogOpen, setEditDialogOpen] = useState(false);

//   const [newRecord, setNewRecord] = useState({ type: '', file: null });
//   const [editRecord, setEditRecord] = useState(null);

//   const [isCameraActive, setIsCameraActive] = useState(false);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [editIsCameraActive, setEditIsCameraActive] = useState(false);
//   const [editCapturedImage, setEditCapturedImage] = useState(null);

//   const [cameraStream, setCameraStream] = useState(null);
//   const [isFrontCamera, setIsFrontCamera] = useState(true);

//   const [selectedRecordId, setSelectedRecordId] = useState(null);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [newOwnerEmail, setNewOwnerEmail] = useState('');

//   const fetchPetDetails = async () => {
//     console.log('📞 fetchPetDetails CALLED');
  
//     const token = localStorage.getItem('token');
//     console.log('🔐 Token in fetchPetDetails:', token);
  
//     if (!token) {
//       console.warn('🚨 No token found, aborting');
//       setError('Authentication required');
//       setLoading(false);
//       return;
//     }
  
//     try {
//       const petResponse = await axios.get(`http://localhost:3000/pets/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log('🐶 Pet Response:', petResponse.data);
//       setPet(petResponse.data);
  
//       const recordsResponse = await axios.get(`http://localhost:3000/medical-records/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log('📋 Medical Records:', recordsResponse.data);
//       setMedicalRecords(recordsResponse.data);
//     } catch (err) {
//         console.error('❌ Error in fetchPetDetails:', err);
//         if (err.response) {
//           console.error('📛 Backend error:', err.response.data);
//         } else {
//           console.error('🧨 Generic error:', err.message);
//         }
//         setError('Failed to load pet details');
//     } finally {
//       console.log('✅ Setting loading to false');
//       setLoading(false);
//     }
//   };
  
  

//   useEffect(() => {
//     console.log('📦 useEffect triggered for id:', id);
//     fetchPetDetails();
//   }, [id]);

//   const handleFileChange = (e) => {
//     setNewRecord({ ...newRecord, file: e.target.files[0] });
//   };

//   const handleRecordSubmit = async () => {
//     const formData = new FormData();
//     formData.append('type', newRecord.type);
//     formData.append('file', newRecord.file);
//     formData.append('pet_id', id);

//     try {
//       const token = localStorage.getItem('token');
//       await axios.post('http://localhost:3000/medical-records', formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       setOpen(false);
//       fetchPetDetails();
//     } catch {
//       alert('Failed to add record');
//     }
//   };

//   const handleStartCamera = async () => {
//     try {
//       const constraints = {
//         video: { facingMode: isFrontCamera ? 'user' : 'environment' },
//       };
//       const stream = await navigator.mediaDevices.getUserMedia(constraints);
//       document.getElementById('camera').srcObject = stream;
//       setCameraStream(stream);
//     } catch {
//       setIsCameraActive(false);
//     }
//   };

//   const handleCaptureImage = () => {
//     const video = document.getElementById('camera');
//     const canvas = document.createElement('canvas');
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const context = canvas.getContext('2d');
//     context.drawImage(video, 0, 0);
//     const imageDataUrl = canvas.toDataURL('image/png');
//     setCapturedImage(imageDataUrl);
//     setIsCameraActive(false);
//   };

//   const handleConvertToPdf = async () => {
//     const pdf = new jsPDF();
//     pdf.addImage(capturedImage, 'PNG', 10, 10, 190, 280);
//     const pdfBlob = pdf.output('blob');

//     const formData = new FormData();
//     formData.append('type', 'Scanned Document');
//     formData.append('file', pdfBlob, 'scanned_document.pdf');
//     formData.append('pet_id', id);

//     try {
//       const token = localStorage.getItem('token');
//       await axios.post('http://localhost:3000/medical-records', formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCapturedImage(null);
//       fetchPetDetails();
//     } catch {
//       alert('Failed to save scanned doc');
//     }
//   };

//   const handleEdit = (record) => {
//     setEditRecord(record);
//     setEditDialogOpen(true);
//   };

//   const handleEditCaptureImage = () => {
//     const video = document.getElementById('edit-camera');
//     const canvas = document.createElement('canvas');
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const context = canvas.getContext('2d');
//     context.drawImage(video, 0, 0);
//     setEditCapturedImage(canvas.toDataURL('image/png'));
//     setEditIsCameraActive(false);
//   };

//   const handleEditConvertToPdf = () => {
//     const pdf = new jsPDF();
//     pdf.addImage(editCapturedImage, 'PNG', 10, 10, 190, 280);
//     const blob = pdf.output('blob');
//     setEditRecord({ ...editRecord, file: blob });
//   };

//   const handleEditSubmit = async () => {
//     const formData = new FormData();
//     formData.append('type', editRecord.type);
//     if (editRecord.file) formData.append('file', editRecord.file);

//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(`http://localhost:3000/medical-records/${editRecord.id}`, formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setEditDialogOpen(false);
//       fetchPetDetails();
//     } catch {
//       alert('Failed to update record');
//     }
//   };

//   const handleDelete = async (recordId) => {
//     if (!window.confirm('Delete this record?')) return;
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`http://localhost:3000/medical-records/${recordId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchPetDetails();
//     } catch {
//       alert('Delete failed');
//     }
//   };

//   const handleTransferOwnership = async () => {
//     try {
//       await petService.transferPetOwnership(id, newOwnerEmail);
//       alert('Ownership transferred!');
//     } catch (err) {
//       alert(err.response?.data?.error || 'Transfer failed');
//     }
//   };

//   console.log('⏳ [Render] Is loading?', loading);
//   console.log('❗ [Render] Error?', error);

//   if (loading) {
//   return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
//       <CircularProgress />
//       </Box>
//     );
//   }


//   if (error) {
//     return <Typography color="error" align="center" sx={{ mt: 4 }}>{error}</Typography>;
//   }

//   return (
//     <Box sx={{ pb: 7, backgroundColor: '#f8f8f8', minHeight: '100vh' }}>
//       <Container sx={{ pt: 3 }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//           <IconButton onClick={() => navigate('/pets')}>
//             <ArrowBackIosNewIcon />
//           </IconButton>
//           <Typography variant="h6" sx={{ ml: 1 }}>
//             Pet Profile
//           </Typography>
//         </Box>

//         <Card>
//           <CardMedia
//             component="img"
//             height="300"
//             image={`http://localhost:3000${pet.photo_url}`}
//             alt={pet.name}
//           />
//           <CardContent>
//             <Typography variant="h4">{pet.name}</Typography>
//             <Typography variant="body1">Breed: {pet.breed}</Typography>
//             <Typography variant="body2">Birthday: {new Date(pet.birthday).toDateString()}</Typography>

//             <Typography variant="h6" sx={{ mt: 3 }}>Medical Records:</Typography>
//             {medicalRecords.map((record) => (
//               <MedicalRecordItem
//                 key={record.id}
//                 record={record}
//                 onClick={() => setSelectedRecordId(record.id)}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//                 selected={selectedRecordId === record.id}
//                 openDropdown={openDropdown}
//                 setOpenDropdown={setOpenDropdown}
//               />
//             ))}
//           </CardContent>
//         </Card>

//         <Box sx={{ mt: 3 }}>
//           <TextField
//             label="New Owner Email"
//             fullWidth
//             value={newOwnerEmail}
//             onChange={(e) => setNewOwnerEmail(e.target.value)}
//           />
//           <Button variant="contained" onClick={handleTransferOwnership} sx={{ mt: 2 }}>
//             Transfer Ownership
//           </Button>
//         </Box>
//       </Container>

//       <IconButton
//         onClick={() => setOpen(true)}
//         sx={{
//           position: 'fixed',
//           bottom: 80,
//           right: 16,
//           backgroundColor: '#ccc',
//           color: '#fff',
//           '&:hover': { backgroundColor: '#bbb' },
//         }}
//       >
//         <AddCircleOutlineIcon sx={{ fontSize: 50 }} />
//       </IconButton>

//       <BottomNav /> {/* ✅ Shared bottom nav */}

//       <AddRecordDialog
//         open={open}
//         onClose={() => setOpen(false)}
//         newRecord={newRecord}
//         setNewRecord={setNewRecord}
//         handleFileChange={handleFileChange}
//         handleStartCamera={handleStartCamera}
//         isCameraActive={isCameraActive}
//         cameraStream={cameraStream}
//         handleCaptureImage={handleCaptureImage}
//         handleCloseCamera={() => setIsCameraActive(false)}
//         capturedImage={capturedImage}
//         handleConvertToPdf={handleConvertToPdf}
//       />

//       <EditRecordDialog
//         open={editDialogOpen}
//         onClose={() => setEditDialogOpen(false)}
//         editRecord={editRecord}
//         setEditRecord={setEditRecord}
//         isCameraActive={editIsCameraActive}
//         setIsCameraActive={setEditIsCameraActive}
//         handleCaptureImage={handleEditCaptureImage}
//         capturedImage={editCapturedImage}
//         handleConvertToPdf={handleEditConvertToPdf}
//         handleSubmit={handleEditSubmit}
//       />
//     </Box>
//   );
// };

// export default PetProfile;
