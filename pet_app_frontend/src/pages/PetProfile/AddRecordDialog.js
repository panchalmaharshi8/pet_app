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

const AddRecordDialog = ({
    open,
    onClose,
    newRecord,
    setNewRecord,
    handleFileChange,
    handleStartCamera,
    isCameraActive,
    handleCaptureImage,
    handleCloseCamera,
    capturedImage,
    handleConvertToPdf,
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Medical Record</DialogTitle>
            <DialogContent>
                {!isCameraActive && !capturedImage && (
                    <>
                        <TextField
                            label="Type of Record"
                            fullWidth
                            margin="normal"
                            value={newRecord.type}
                            onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
                        />
                        <Button component="label" fullWidth>
                            Upload from Device
                            <input type="file" hidden accept="application/pdf,image/*" onChange={handleFileChange} />
                        </Button>
                        <Button
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={() => {
                                handleStartCamera();
                            }}
                        >
                            Scan Document
                        </Button>
                    </>
                )}

                {isCameraActive && (
                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <video
                            id="camera"
                            autoPlay
                            playsInline
                            style={{ width: '100%', maxHeight: '400px', border: '1px solid #ccc' }}
                        />
                        <Button onClick={handleCaptureImage} variant="contained" sx={{ mt: 2 }}>
                            Capture
                        </Button>
                        <Button onClick={handleCloseCamera} color="error" sx={{ mt: 2 }}>
                            Cancel
                        </Button>
                    </Box>
                )}

                {capturedImage && (
                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="h6">Preview</Typography>
                        <img src={capturedImage} alt="Captured" style={{ width: '100%' }} />
                        <Button onClick={handleConvertToPdf} variant="contained" sx={{ mt: 2 }}>
                            Save as PDF
                        </Button>
                        <Button onClick={() => setNewRecord({ ...newRecord, file: null })} color="error" sx={{ mt: 2 }}>
                            Retake
                        </Button>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddRecordDialog;
