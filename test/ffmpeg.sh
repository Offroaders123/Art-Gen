ffmpeg \
  -loop 1 \
  -framerate 1 \
  -i "26.png" \
  -i "26.m4a" \
  -map 0 \
  -map 1:a \
  -c:v libx264 \
  -preset ultrafast \
  -tune stillimage \
  -vf scale=out_color_matrix=bt709,fps=10 \
  -pix_fmt yuv420p \
  -c:a copy \
  -shortest \
  "26.mp4"