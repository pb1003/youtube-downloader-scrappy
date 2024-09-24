import express from "express";
import { createClient } from "redis";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';
import getVideoMetadata from "./metadata.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
app.use(cors())

const client = await createClient()
    .on('error', err => console.log('Redis Client Error', err))
    .connect();

const subscriber = await createClient()
    .on('error', err => console.log('Redis Client Error', err))
    .connect();
app.get('/', (req, res) => {

    console.log("hello in the server")
    res.send("waddup")
})


app.get('/metadata',async(req,res)=>{

    const url = req.query.url
    const metadata = await getVideoMetadata(url)
    res.json(metadata)


    })

app.get('/download', async (req, res) => {
    const url = req.query.url
    if (!url) res.status(400).send("Please provide a url")
    const video_id = Date.now()
    const video = { "video_id": video_id, "url": url }
    try {
        await client.lPush("video", JSON.stringify(video))

        await subscriber.subscribe("download_complete", (message) => {
            console.log(`message received  : ${message}`)

            console.log(`video:::${message}`);
            const file = path.join(__dirname, `../worker/${message}`)
            console.log('file path :::',file)
            // res.status(200).send("hulloooooo")
            if (fs.existsSync(file)) {
                res.status(200).json({ fileUrl: `http://localhost:3000/files/${video_id}.mp4` });
            } else {
                res.status(500).send('File not found');
            }

        })



    }
    catch (error) {
        console.log(error)
        res.status(400).send('error downloading the video')
    }

})
app.use('/files', express.static(path.join(__dirname, '../worker')));

app.listen(3000)