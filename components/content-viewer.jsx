'use client'
// components/BookReader.tsx
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useUIState, useActions } from 'ai/rsc';
import { UserMessage } from './stocks/message'
import { nanoid } from 'nanoid';
import PDFViewer from '@/components/pdf-view';
import { sleep } from 'openai/core';


// import {put} from '@vercel/blob';



const BookReader = ( ) => {
  const [selectedText, setSelectedText] = useState({text : '', page: ''});
  const [selectedTextMetadata, setSelectedTextMetadata] = useState();
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useUIState()
  const { submitUserMessage } = useActions()
  
  
 
 



  const submitQuery = async () => {
   
      setMessages(currentMessages => [
        ...currentMessages,
        {
          id: nanoid(),
          display: <UserMessage>{selectedText.text}</UserMessage>
        }
      ])

      const responseMessage = await submitUserMessage(
        selectedText.text
      )

      setMessages(currentMessages => [
        ...currentMessages,
        responseMessage
      ])
    }


  // Handle text selection
  const handleTextSelect = () => {
    const selection = window.getSelection();
    if (selection) {
      const selectedText = selection.toString().trim();
      if (selectedText) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectedText({text : selectedText});
        setTooltipPosition({ x: rect.left, y: rect.top});
        setShowTooltip(true);
        console.log("working");
      } else {
        setShowTooltip(false);
      }
    }
  };

  //Get selected text page numbers, item 

  const getSelectionMetadata = ({ pageNumber }) => {
  
    setSelectedText( prev => ({
      text : prev.text,
      page : pageNumber,
    }))

  }

  // Handle "Add AI" button click
  const handleAddAIClick = () => {
    // TODO: Implement functionality for "Add AI" button
    submitQuery()
    window.getSelection().removeAllRanges();
    setSelectedText({text : '', page :''});
    setShowTooltip(false);
   
    };

  

  // Handle "Explain" button click
  const handleExplainClick = () => {
    // TODO: Implement functionality for "Explain" button
    submitQuery()
    window.getSelection().removeAllRanges();
    setSelectedText({text :'', page : ''});
    setShowTooltip(false);
   
  };

  return (
    <div onMouseUp={handleTextSelect}>
    {/* { book.map((page)=>{
     return <>
      <p id={page.metadata.loc.pageNumber} style={{'whiteSpace': 'pre-line'}} className='p-4 mb-5'>
        {page.pageContent}
      </p>
      <Separator/>
      </>
    })}  */}
    <PDFViewer pdfPath={'/test.pdf'} getSelectionMetadata={getSelectionMetadata}/>
    
      {showTooltip && (
        <div
          className="absolute bg-background border border-gray-300 rounded-md"
          style={{ left: tooltipPosition.x, top: tooltipPosition.y, zIndex : 2 }}
        >
     
          <Button onClick={handleAddAIClick}>Add AI</Button>
          {/* <Separator orientation='vertical'/> */}
          <Button onClick={handleExplainClick} >Explain</Button>
        </div>
      )}
    </div>
  );
};

export default BookReader;