# yt_dlp_download.py
import sys
import yt_dlp

def download_video(url,filename):

    ydl_opts = {
        'outtmpl': filename,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

if __name__ == "__main__":
    video_url = sys.argv[1]
    filename = sys.argv[2]
    download_video(video_url,filename)
