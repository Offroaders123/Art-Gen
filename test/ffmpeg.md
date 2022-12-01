# FFmpeg

Figured out how to encode my generated thumbnail alongside my song audio into a video, using FFmpeg! 

These resources helped me out getting started with it:

- [How to create video from audio files using ffmpeg (StackOverflow)](https://stackoverflow.com/questions/62756006/how-to-create-video-from-audio-files-using-ffmpeg)
- [How to merge audio and video file in ffmpeg (SuperUser)](https://superuser.com/questions/277642/how-to-merge-audio-and-video-file-in-ffmpeg)
- [Fastest way to combine an image and audio file to make a video using ffmpeg (SuperUser)](https://superuser.com/questions/1584488/fastest-way-to-combine-an-image-and-audio-file-to-make-a-video-using-ffmpeg) (\*)
- [FFmpeg: Add Background Image to an Audio File (YouTube)](https://www.youtube.com/watch?v=dqYAKuljC38)

*\* This is the one I went with which ended up working!*

```shell
$ ffmpeg -loop 1 -framerate 1 -i 26.png -i 26.m4a -map 0 -map 1:a -c:v libx264 -preset ultrafast -tune stillimage -vf fps=10,format=yuv420p -c:a copy -shortest 26.mp4
```