import 'server-only'
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import path from "path";
import { json } from 'stream/consumers';
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "langchain/document"
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { TokenTextSplitter } from 'langchain/text_splitter';
import { nanoid } from 'nanoid';

const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index('studybuddy');
const vectorStore = await PineconeStore.fromExistingIndex(
  new OpenAIEmbeddings(),
  { pineconeIndex }
);

const getBook = async () => {
    'use server'
    const loader = new PDFLoader(path.join(process.cwd(),'lib/pdf','book.pdf'));
    // console.log(process.cwd())
    const docs = await loader.load()
    // console.log(docs)
  
    return JSON.stringify(docs)
}


// Instantiate a new Pinecone client, which will automatically read the
// env vars: PINECONE_API_KEY and PINECONE_ENVIRONMENT which come from
// the Pinecone dashboard at https://app.pinecone.io


/* eslint-disable @typescript-eslint/no-non-null-assertion */


// Instantiate a new Pinecone client, which will automatically read the
// env vars: PINECONE_API_KEY and PINECONE_ENVIRONMENT which come from
// the Pinecone dashboard at https://app.pinecone.io



const uploadPinecone = async () => {
  'use server'
  const loader = new PDFLoader(path.join(process.cwd(),'lib/pdf','book.pdf'));
  const docId = nanoid();
  // console.log('bookid', '--', docId);
  // console.log(process.cwd())

  const splitter = new TokenTextSplitter({
    encodingName: "gpt2",
    chunkSize: 1500,
    chunkOverlap: 200,
  });
  const docs = await loader.loadAndSplit(splitter)

  docs.forEach(doc => {
    doc.metadata['docId']= docId
  });
    await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
        pineconeIndex,
        maxConcurrency: 5, 
      });

}

const getContext = async (prompt) => {

/* Search the vector DB independently with metadata filters */
const results = await vectorStore.similaritySearch(prompt, 3, {
  foo: "bar",
});
console.log(results);
/*
  [
    Document {
      pageContent: 'pinecone is a vector db',
      metadata: { foo: 'bar' }
    }
  ]
*/

}

export {getBook, uploadPinecone, getContext}