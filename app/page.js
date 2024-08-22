'use client'
import axios from "axios";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import ThemeController from "./components/ThemeController";
import Navbar from "./components/Navbar";
import Collapse from "./components/Collapse";
import Footer from "./components/Footer";


export default function Home() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [audioSrc, setAudioSrc] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [status, setStatus] = useState('Upload');
  const [disable, setDisable] = useState(true);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState('')
  const ffmpegRef = useRef(new FFmpeg());

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setLoading(false);
    setStatus('Upload!')
  };

  useEffect(() => {
    load();
  }, [])


  // const handleCheck = async () => {
  //   const response = await axios.get('https://my-summary-server.netlify.app/.netlify/functions/api/api/upload');
  //   setMessage(response.data.message)
  //   console.log(response);
  // }

  const load = async () => {
    console.log('LOADING')
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on('log', ({ message }) => {
      console.log(message);
    });
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    setLoaded(true);
  }
  const parseResponse = (responseText) => {
    // Helper function to extract text between two markers
    const extractValue = (startMarker, endMarker) => {
      const startIndex = responseText.indexOf(startMarker);
      if (startIndex === -1) return '';
  
      const start = startIndex + startMarker.length;
      // If there's no endMarker, extract till the end of the text
      const endIndex = endMarker ? responseText.indexOf(endMarker, start) : responseText.length;
      return endIndex === -1 ? responseText.substring(start).trim() : responseText.substring(start, endIndex).trim();
    };
  
    // Define the markers
    const originalLanguageMarker = '**Original Language:**';
    const convertedToMarker = '**Converted to:**';
    const contextMarker = '**Context:**';
    const summaryMarker = '**Summary:**';
  
    return {
      original_language: extractValue(originalLanguageMarker, convertedToMarker),
      converted_to: extractValue(convertedToMarker, contextMarker),
      context: extractValue(contextMarker, summaryMarker),
      summary: extractValue(summaryMarker, ''), // Extract till the end if no end marker
    };
  };
  const handleConvert = async (e) => {
    e.preventDefault();
    setStatus("Converting Video into Audio file....")
    console.log(file)
    setLoader(true);
    setLoading(true);
    console.log('TRANSCODE');
    const ffmpeg = ffmpegRef.current;
    console.log('REF');
    console.log(await ffmpeg.writeFile('input.mp4', await fetchFile(file)));

    await ffmpeg.writeFile('input.mp4', await fetchFile(file));
    console.log('WRITE FILE');
    await ffmpeg.exec(['-i', 'input.mp4', 'output.mp3']);
    console.log('EXEC FILE');
    const data = await ffmpeg.readFile('output.mp3');
    console.log(data);
    const blob = new Blob([data], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    console.log(url);
    setAudioSrc(url);
    setStatus("Summarizing....")
    const buffer = Buffer.from(data); // Convert Uint8Array to Buffer
    const formData = new FormData();
    formData.append('audio', blob, 'output.mp3');
    try {
      // const response = await axios.post('https://my-summary-server.onrender.com/api/upload', formData, {
      //   headers: {
      //     'Content-Type': 'application/octet-stream',
      //   },
      // });
      const response = await axios.post('https://my-summary-server.netlify.app/.netlify/functions/api/api/upload', formData, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });
      
      console.log('Upload successful');
      console.log(response);

      console.log('Transcription: ', response.data.transcription);
      console.log('Summary: ', response.data.summary);
      setTranscription(response.data.transcription)
      setSummary(response.data.summary);
      const data = parseResponse(response.data.summary);
      console.log(data);
      
      setData(data);
      setStatus("Summarized")
      setLoader(false);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col">
      <div className="flex flex-col items-center flex-grow mt-12">
        <h1 className="text-4xl font-bold mb-8">Video Summary</h1>
        <form
          // onSubmit={handleSubmit} 
          // encType="multipart/form-data" 
          className="flex flex-col items-center">
          <input
            type="file"
            onChange={handleFileChange}
            accept="video/*"
            name="video"
            className="file-input file-input-bordered file-input-primary w-full max-w-md mb-5"
          />
          <button
            onClick={handleConvert}
            disabled={loading}
            className="btn btn-neutral text-neutral-content"
          >
            {status}
          </button>
          {loader && <span className="loading loading-bars loading-md mt-1"></span>}

        </form>
        {/* <button
        onClick={handleCheck}
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        Check Connection
      </button> */}
        {summary && (
          <Collapse 
          // summary={summary} 
          data={data} />
        )}
        {message && (
          <div className="mt-8 p-4 border rounded shadow-md w-2/3">
            <p className="text-lg text-green-500">{message}</p>
          </div>
        )}
        {transcription && (
          <Collapse transcription={transcription} />
        )}
        {audioSrc &&
          <Collapse audioSrc={audioSrc} />
        }
        
      </div>
      <Footer />
      </div>
    </>
  );
}
