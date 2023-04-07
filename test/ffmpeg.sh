for thumbnail in ./*.png
do
  name=$(basename -s .png "$thumbnail")
  audio="../$name.wav"
  video="./$name.mp4"

  # Debug
  # echo $thumbnail
  # echo $name
  # echo $audio
  # echo $video
  # echo ""

  ffmpeg \
    -loop 1 \
    -framerate 1 \
    -i "$thumbnail" \
    -i "$audio" \
    -map 0 \
    -map 1:a \
    -c:v libx264 \
    -preset ultrafast \
    -tune stillimage \
    -vf "scale=out_color_matrix=bt709,fps=10,format=yuv420p" \
    -c:a aac \
    -shortest \
    "$video"
done