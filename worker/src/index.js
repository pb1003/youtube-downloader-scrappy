import { createClient } from 'redis';
import  {downloadVideo}  from './downloader.js';
const client = await createClient()


  try {
    await client.connect()
    console.log("Worker connected to redis")
    while (1) {
      try {
        const videoObject = await client.brPop("video", 0)
        const info = await downloadVideo(videoObject)
        // publish to a queue , downloaded_video
        console.log(info)
      }
      catch (error) {
        console.error("Error in the queue", error)
      }
    }
  }
  catch (err) {
    console.error(err)
  }





