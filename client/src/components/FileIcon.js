import React from 'react';
import { FaFilePdf, FaFileWord, FaFileImage } from 'react-icons/fa';
import { Tooltip, IconButton } from '@mui/material';

const FileIcon = ({ fileName }) => {
  const fileExtension = fileName.split('.').pop().toLowerCase();

  let icon;
  switch (fileExtension) {
    case 'pdf':
      icon = <FaFilePdf />;
      break;
    case 'docx':
    case 'doc':
      icon = <FaFileWord />;
      break;
    case 'jpg':
    case 'jpeg':
    case 'png':
      icon = <FaFileImage />;
      break;
    default:
      icon = <FaFilePdf />;  
  }

  return (
    <Tooltip title={fileName}>
      <IconButton
        component="a"
        href={`http://localhost:5000/uploads/${fileName}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'white' }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default FileIcon;
