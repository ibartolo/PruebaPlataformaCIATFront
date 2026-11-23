# Notas — Video (pipeline y entrega)

## 1. Qué se hizo al video de prueba

1. **Renombrado** a `video.mp4` (el nombre original tenía acentos/espacios que rompían la URL).
2. **`faststart`**: mover el índice `moov` al inicio del MP4 (arranque rápido, antes tardaba ~5 min).
3. **Conversión a HLS**: `anexos/hls/video.m3u8` + 180 segmentos `.ts` (adelantar es instantáneo, sin trabas).
4. **`hls.min.js` local** (en la raíz) para reproducir HLS en Chrome/Edge/Android; Safari usa HLS nativo.
5. **`controlsList="nodownload"`** en el `<video>` (quita el botón de descargar en Chrome/Android; en iOS Safari no se puede con HTML).
6. **`web.config`** con los MIME types de `.m3u8`, `.ts` y `.mp4`.

## 2. Comandos ffmpeg para repetir con otros videos

```
# faststart (arranque rápido)
ffmpeg -i video.mp4 -c copy -movflags +faststart salida.mp4

# HLS (adelanto instantáneo)
ffmpeg -i video.mp4 -c copy -hls_time 6 -hls_playlist_type vod -hls_segment_filename "segment_%03d.ts" video.m3u8
```

- `-c copy` = sin re-codificar (no pierde calidad).
- `-hls_time 6` = segmentos de 6 segundos.

## 3. Cómo pedir los videos a CIATSOFTWARE

Para que cada video del curso funcione igual (cargue rápido y se pueda adelantar), pedir al equipo que graba/edita:

1. **Exportar en MP4 con códec H.264 (video) + AAC (audio).**
2. **Activar "fast start" / "web optimized" al exportar** (Premiere, Camtasia, DaVinci, etc. lo tienen). Es lo que evita la espera larga al inicio.
3. **Keyframes cada 2–6 segundos** (GOP corto) — para que el adelanto sea suave al convertir a HLS.
4. **Resolución/bitrate razonables**: 720p a ~1–2 Mbps (o 1080p a ~3–4 Mbps si el curso lo exige).
5. **Entregar el MP4 "master"** (sin comprimir en exceso). La conversión a HLS la hacemos nosotros con ffmpeg.

## 4. Servidor (ya resuelto)

- `web.config` define: `.m3u8` → `application/vnd.apple.mpegurl` · `.ts` → `video/mp2t` · `.mp4` → `video/mp4`.
- Subir a la raíz: `index.html`, `hls.min.js`, `web.config` + la carpeta `anexos/` (con `hls/` y los `.txt`/`.pdf`).
