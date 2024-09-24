import ytdl from "ytdl-core";

 const getVideoMetadata = async (url) => {

    const info = await ytdl.getInfo(url)

    const formats = info.formats.filter((format) => (format.hasAudio && format.hasVideo))


    console.log(`formats::::`,formats);
    return {
        title: info.videoDetails.title,
        lengthSeconds: info.videoDetails.lengthSeconds,
        info
    }



}


export default getVideoMetadata