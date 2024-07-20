
import { spawn } from 'child_process';
import { createClient  } from "redis";


const client = await createClient()
  .on('error', err => console.log('Redis Client Error', err))
  .connect();

export function downloadVideo(video) {

    return new Promise((resolve, reject) => {
        //generate some filename
        const videoObject = JSON.parse(video.element)
        const filename = videoObject.video_id+".mp4"
        const pythonProcess = spawn('python3', ['src/downloadworker.py', videoObject.url,filename])

        // pythonProcess.stdout.on('data', (data) => {
        //     console.log(`stdout: ${data}`);
        // });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {

                resolve(`Download completed. Your file is ${filename}`)
                client.publish("download_complete",filename)
                .then(()=>{
                    console.log("published")
                })
                .catch(()=>{
                 console.error('Error publishing to channel:', err);
                })
              

            }
            else {
                reject(console.log(`child process exited with code ${code}`));
            }
        });
    })
}



