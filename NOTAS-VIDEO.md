# Notas — Video (pipeline y entrega)

## 1. Qué se hizo al video de prueba

1. **Renombrado** a `video.mp4` (el nombre original tenía acentos/espacios que rompían la URL).
2. **`faststart`**: mover el índice `moov` al inicio del MP4 (arranque rápido, antes tardaba ~5 min).
3. **Conversión a HLS**: `anexos/hls/video.m3u8` + 180 segmentos `.ts` (adelanto instantáneo, sin trabas).
4. **Cifrado AES-128**: los segmentos van cifrados; el `video.m3u8` lleva `#EXT-X-KEY:METHOD=AES-128,URI="enc.key",IV=0x...`. Se agregó la llave `enc.key` (16 bytes).
5. **`hls.min.js` local** (en la raíz) para reproducir HLS en Chrome/Edge/Android; Safari usa HLS nativo.
6. **`controlsList="nodownload"`** en el `<video>` (quita el botón de descargar en Chrome/Android; en iOS Safari no se puede con HTML).
7. **`web.config`** con los MIME types de `.m3u8`, `.ts` y `.mp4`.

> ⚠️ **AES-128 ≠ DRM**: evita la descarga casual (no se pueden reproducir los `.ts` sin la llave), pero la llave se entrega al navegador → **NO evita grabar pantalla**. Protección real (pantalla negra) = **DRM/VdoCipher** (pendiente).

## 2. Comandos ffmpeg para repetir con otros videos

```
# faststart (arranque rápido)
ffmpeg -i video.mp4 -c copy -movflags +faststart salida.mp4

# HLS sin cifrar (adelanto instantáneo)
ffmpeg -i video.mp4 -c copy -hls_time 6 -hls_playlist_type vod -hls_segment_filename "segment_%03d.ts" video.m3u8

# HLS CIFRADO AES-128 (usar enc.keyinfo con IV explícito)
ffmpeg -i video.mp4 -c copy -hls_time 6 -hls_playlist_type vod -hls_key_info_file "enc.keyinfo" -hls_segment_filename "segment_%03d.ts" video.m3u8
```

- `-c copy` = sin re-codificar (no pierde calidad).
- `-hls_time 6` = segmentos de 6 segundos.
- **IV explícito obligatorio** en `enc.keyinfo` (3ra línea, 32 hex). Sin IV, ffmpeg escribe uno que no coincide al desencriptar.

**Formato de `enc.keyinfo`**:
```
enc.key
C:/ruta/absoluta/a/enc.key
<iv_hex_32_caracteres>
```

**Generar la llave (16 bytes)**: bytes aleatorios. Ej. PowerShell:
```
$k = New-Object byte[] 16; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($k); [IO.File]::WriteAllBytes("enc.key",$k)
```

**Validar el cifrado**: desencriptar un segmento (AES-128-CBC, key + IV del m3u8) y confirmar byte `0x47` en posiciones 0, 188, 376 (sync MPEG-TS). El test de ffmpeg leyendo el HLS cifrado puede dar falso negativo por resolución de ruta de la llave.

## 3. Cómo pedir los videos a CIATSOFTWARE

Para que cada video del curso funcione igual (cargue rápido y se pueda adelantar), pedir al equipo que graba/edita:

1. **Exportar en MP4 con códec H.264 (video) + AAC (audio).**
2. **Activar "fast start" / "web optimized" al exportar** (Premiere, Camtasia, DaVinci, etc. lo tienen). Es lo que evita la espera larga al inicio.
3. **Keyframes cada 2–6 segundos** (GOP corto) — para que el adelanto sea suave al convertir a HLS.
4. **Resolución/bitrate razonables**: 720p a ~1–2 Mbps (o 1080p a ~3–4 Mbps si el curso lo exige).
5. **Entregar el MP4 "master"** (sin comprimir en exceso). La conversión a HLS + cifrado la hacemos nosotros con ffmpeg.

## 4. Qué subir al servidor

**Raíz del sitio:**
- `index.html`, `hls.min.js`, `web.config`

**`anexos/`:**
- `anexo1.txt`, `anexo2.txt`, `anexo3.pdf`

**`anexos/hls/`** (subir la carpeta completa):
- `video.m3u8`
- `segment_000.ts` … `segment_179.ts` (cifrados)
- `enc.key` ← necesario
- ❌ **NO subir** `enc.keyinfo` (es solo de generación)

- `web.config` define: `.m3u8` → `application/vnd.apple.mpegurl` · `.ts` → `video/mp2t` · `.mp4` → `video/mp4`.
