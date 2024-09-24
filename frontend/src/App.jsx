import { useState } from 'react'
import Spinner from './components/spinner.jsx';
const API_URL = import.meta.env.VITE_API_URL || '/api';

function App() {
  const [inputUrl, setInputUrl] = useState('')
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  // const API_URL = 'http://server:3000/download';

  const handleSubmit =async (e) => {
    e.preventDefault()
  
  
    console.log("Downloading  ::::", inputUrl)


    setLoading(true);
    setError(null);
    try {
        const response = await fetch(`${API_URL}/download?url=`+inputUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setFileUrl(result.fileUrl); // Update this according to your server's response

        setData(result);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  }
  return (
    <>
      <div className='flex justify-center items-center h-screen'>
        <div className='w-full'>
          <div className='flex justify-center'>
          <h1>Welcome to My-downloader</h1>
          </div>
          {/* <form onSubmit={handleSubmit}>
            <input type="text" id="input-url" className='' placeholder='enter video url' value={inputUrl} onChange={(e)=>(setInputUrl(e.target.value))} />
            <button type="submit">Search</button>

          </form> */}

          <form class="max-w-md mx-auto" onSubmit={handleSubmit}>
            {/* <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label> */}
            <div class="relative">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                {/* <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg> */}
              </div>
              <input value={inputUrl} onChange={(e) => (setInputUrl(e.target.value))} type="search" id="default-search" class="block w-full p-4 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" Download url" required />
              <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Verify link</button>
            </div>
          </form>

          {loading && <Spinner/>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {fileUrl && (
            <div className="flex justify-center mt-4">
            <a href={fileUrl} download>
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Download File
              </button>
            </a>
          </div>
          )}

        </div>
      </div>
    </>
  )
}

export default App
