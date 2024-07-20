import express from "express";
import { createClient } from "redis";

const app = express()

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
            res.status(200).send("hulloooooo")

        })



    }
    catch (error) {
        console.log(error)
        res.status(400).send('error downloading the video')
    }

})

app.listen(3000)