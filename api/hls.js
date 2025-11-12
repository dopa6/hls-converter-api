import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).send('No URL specified');

  try {
    if (!ffmpeg.isLoaded()) await ffmpeg.load();


    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    ffmpeg.FS('writeFile', 'input.mkv', new Uint8Array(buffer));

    
    await ffmpeg.run(
      '-i', 'input.mkv',
      '-codec:v', 'libx264',
      '-codec:a', 'aac',
      '-f', 'hls',
      '-hls_time', '5',
      '-hls_playlist_type', 'vod',
      'output.m3u8'
    );

  
    const hlsData = ffmpeg.FS('readFile', 'output.m3u8');
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.send(Buffer.from(hlsData));
  } catch (e) {
    console.error(e);
    res.status(500).send('Error converting video to HLS');
  }
}
