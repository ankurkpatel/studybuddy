'use client'
// components/BookReader.tsx
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useUIState, useActions } from 'ai/rsc';
import { UserMessage } from './stocks/message'
import { nanoid } from 'nanoid';

const BookReader = ({ book }) => {
  const [selectedText, setSelectedText] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useUIState()
  const { submitUserMessage } = useActions()

  useEffect(()=>{
    console.log(book)
  } ,[])

  const submitQuery = async () => {
   
      setMessages(currentMessages => [
        ...currentMessages,
        {
          id: nanoid(),
          display: <UserMessage>{selectedText}</UserMessage>
        }
      ])

      const responseMessage = await submitUserMessage(
        selectedText
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
        setSelectedText(selectedText);
        setTooltipPosition({ x: rect.left, y: rect.top});
        setShowTooltip(true);
      } else {
        setShowTooltip(false);
      }
    }
  };

  // Handle "Add AI" button click
  const handleAddAIClick = () => {
    // TODO: Implement functionality for "Add AI" button
    console.log('Add AI button clicked with selected text:', selectedText);
    submitQuery()
    window.getSelection().removeAllRanges();
    setSelectedText('');
    setShowTooltip(false);
   
    };

  // Handle "Explain" button click
  const handleExplainClick = () => {
    // TODO: Implement functionality for "Explain" button
    submitQuery()
    window.getSelection().removeAllRanges();
    setSelectedText('');
    setShowTooltip(false);
   
  };

  return (
    <div onMouseUp={handleTextSelect}>
    { book.map((page)=>{
     return <>
      <p id={page.metadata.loc.pageNumber} style={{'whiteSpace': 'pre-line'}} className='p-4 mb-5'>
        {page.pageContent}
      </p>
      <Separator/>
      </>
    })} 
        
    
      {showTooltip && (
        <div
          className="absolute bg-background border border-gray-300 rounded-md"
          style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
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