import React from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';

const MedicalRecordItem = ({
    record,
    onClick,
    onEdit,
    onDelete,
    selected,
    openDropdown,
    setOpenDropdown,
}) => {
    return (
        <Box sx={{ mt: 2 }}>
            <Box
                onClick={onClick}
                sx={{
                    cursor: 'pointer',
                    p: 2,
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    boxShadow: 1,
                    position: 'relative',
                }}
            >
                <Typography variant="subtitle1">{record.type}</Typography>
                {selected && (
                    <Box sx={{ mt: 2 }}>
                        <iframe
                            src={`http://localhost:3000${record.file_url}`}
                            title={record.type}
                            style={{
                                width: '100%',
                                height: '400px',
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                            }}
                        />
                    </Box>
                )}

                <IconButton
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(record.id === openDropdown ? null : record.id);
                    }}
                >
                    <span>⋮</span>
                </IconButton>

                {openDropdown === record.id && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 40,
                            right: 8,
                            backgroundColor: '#fff',
                            border: '1px solid #ddd',
                            borderRadius: 2,
                            boxShadow: 2,
                            zIndex: 5,
                            p: 1,
                        }}
                    >
                        <Button onClick={() => onEdit(record)}>Edit</Button>
                        <Button onClick={() => onDelete(record.id)}>Delete</Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default MedicalRecordItem;
