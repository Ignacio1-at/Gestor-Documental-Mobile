import React from 'react';
import { ImageViewer } from './DetalleDocumento';
import PdfViewer from './DetalleDocumento/PDFViewer';

interface DocumentViewerProps {
  uri: string;
  fileName: string;
  type: 'image' | 'pdf';
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ uri, fileName, type }) => {
  if (type === 'image') {
    return <ImageViewer uri={uri} fileName={fileName} />;
  }
  
  if (type === 'pdf') {
    return <PdfViewer uri={uri} fileName={fileName} />;
  }
  
  return null;
};

export default DocumentViewer;