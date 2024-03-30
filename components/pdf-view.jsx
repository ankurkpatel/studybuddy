"use client";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { get } from "http";

const PDFViewer = ({ pdfPath, getSelectionMetadata }) => {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }


  return (
    <div>
      <Document file={pdfPath} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page 
          key={`page_${index + 1}`} 
          pageNumber={index + 1}
          onClick={
            ()=> {
              getSelectionMetadata({pageNumber:index+1})
            }
          }
          scale={1.2}
          />
        ))}
      </Document>
    </div>
  );
};

export default PDFViewer;