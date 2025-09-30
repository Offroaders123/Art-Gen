# Art-Gen

An app to generate thumbnails for YouTube Art Tracks!

I essentially plan on making a programmatic way to generate the thumbnail and video for multiple song files at a time, then proceeding to upload each of them to YouTube directly, and ensuring that they upload in the exact order that matches the order of your album.

## Future goals moving forward

*Just giving some context to GPT to see what different things I am concerned with for moving forwards with this project, as it is a bit of a mess to upkeep it, use it, and, yeah. No regular user is going to want to deal with the tech debt of having to install a bunch of tools they don't understand, just to make a simple fix of creating the video themselves in iMovie. Curious what it comes up with! I'm all ears.*

Right now, I have a JS project I made which creates art tracks for songs and artwork you provide to it. It is a CLI script, so it runs with Node.js, and is installed from the repo directly, with npm (not on the global registry itself, just GitHub). Under the hood, it uses Puppeteer for the rendering of the image (it needs some way to internally use a CSS rendering engine), then it uses ffmpeg to construct the video, in combination from the source song audio, and the PNG that Puppeteer generate for us, from the song's metadata (it is an M4A provided to the tool, so it already has the artist, album, and track info, and album art).

I am debating whether this is too shattered of a setup, since it likely unnecessarily uses Node.js as the central point of everything. I also wonder whether having all of these be installed independently makes it essentially unusable for anyone outside of the tech space. Why would they need to know what ffmpeg even is? Let alone Node.js. And that it's CLI only too, that makes it even more of a turn off for people. For me, this works great. Small download sizes, it uses tools I already have installed, because I already use them frequently on their own on my machine.

I am wondering whether making it more accessible is the goal, or if I don't necessarily want that. Before making decisions, I am trying to understand the parts of the stack I do actually need. In theory, I could bundle all of what I have now into a single-file executable, albeit with some other linking things like having a build of ffmpeg. Possibly complex, and if I am to do that, I might as well just skip Node.js for something else. Same with Puppeteer and a bundled Chromium build, most likely. Does it have to be Chromium? Unfortunately, the way I need to render the images, they only seem to work with Chromium.

I wanted to try making this into solely a browser-first app, that would be ideal. Everything would be in the client. Dealing with ffmpeg and or WASM was getting to be a headache though.

The current thought I have is that I could use Electron. That would "solve" all of this. It has Chromium (so I could use Puppeteer for that engine installed with the app), I could use that for the GUI, hence making it both more UX-friendly (not simply just a CLI), as well as it being a single file to install to use and run.

But that has a trade-off too. I then am stuck in the Electron world. If someone wanted to use the tool for the logic itself, whether it's simply just for their own automated CLI script thing they are writing, having to download all of Electron to just not use it itself? Seems a bit much. So I don't want Electron vendor lock-in either. I love Electron, but it is a big thing to step into, and step out of. Not very trivial.
