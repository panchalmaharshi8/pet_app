import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
} from '@mui/material';

const EditRecordDialog = ({
    open,
    onClose,
    editRecord,
    setEditRecord,
    isCameraActive,
    setIsCameraActive,
    handleCaptureImage,
    capturedImage,
    handleConvertToPdf,
    handleSubmit,
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Medical Record</DialogTitle>
            <DialogContent>
                <TextField
                    label="Type of Record"
                    fullWidth
                    margin="normal"
                    value={editRecord?.type || ''}
                    onChange={(e) => setEditRecord({ ...editRecord, type: e.target.value })}
                />

                {!isCameraActive && !capturedImage && (
                    <>
                        <Button component="label" fullWidth>
                            Upload New Document
                            <input
                                type="file"
                                hidden
                                accept="application/pdf,image/*"
                                onChange={(e) =>
                                    setEditRecord({ ...editRecord, file: e.target.files[0] })
                                }
                            />
                        </Button>
                        <Button
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={() => {
                                setIsCameraActive(true);
                            }}
                        >
                            Scan Document
                        </Button>
                    </>
                )}

                {isCameraActive && (
                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <video
                            id="edit-camera"
                            autoPlay
                            playsInline
                            style={{ width: '100%', maxHeight: '400px', border: '1px solid #ccc' }}
                        />
                        <Button onClick={handleCaptureImage} variant="contained" sx={{ mt: 2 }}>
                            Capture Photo
                        </Button>
                        <Button onClick={() => setIsCameraActive(false)} color="error" sx={{ mt: 2 }}>
                            Cancel
                        </Button>
                    </Box>
                )}

                {capturedImage && (
                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="h6">Preview Captured Image</Typography>
                        <img src={capturedImage} alt="Captured" style={{ maxWidth: '100%' }} />
                        <Button onClick={handleConvertToPdf} variant="contained" sx={{ mt: 2 }}>
                            Save as PDF
                        </Button>
                        <Button onClick={() => setIsCameraActive(false)} color="error" sx={{ mt: 2 }}>
                            Retake
                        </Button>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditRecordDialog;
