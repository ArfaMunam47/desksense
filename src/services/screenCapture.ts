import { ScreenCapture } from '../types';

export interface CaptureOptions {
  preferCurrentTab?: boolean;
}

/**
 * Capture screen frame using the browser's getDisplayMedia API.
 * Immediately stops all tracks as soon as the snapshot is captured to prevent continuous recording.
 */
export async function captureScreenFrame(): Promise<ScreenCapture> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
    throw new Error(
      'Screen capture API (getDisplayMedia) is not supported in this browser. You can paste an image with Ctrl+V or upload a screenshot file instead.'
    );
  }

  let stream: MediaStream | null = null;
  try {
    // Request explicit display media permission from the user
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        displaySurface: 'monitor',
      },
      audio: false,
    });

    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) {
      throw new Error('No video track was returned by screen capture.');
    }

    // Create a hidden video element to render the frame
    const video = document.createElement('video');
    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => {
        video.play().then(() => resolve()).catch(reject);
      };
      video.onerror = () => reject(new Error('Failed to render captured screen video.'));
    });

    // Short wait to ensure first valid video frame is rendered
    await new Promise((resolve) => setTimeout(resolve, 200));

    const width = video.videoWidth || 1920;
    const height = video.videoHeight || 1080;

    // Draw frame onto offscreen canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not initialize canvas context for screenshot.');
    }

    ctx.drawImage(video, 0, 0, width, height);

    // Stop all media tracks immediately to ensure privacy
    stream.getTracks().forEach((track) => track.stop());
    stream = null;

    const dataUrl = canvas.toDataURL('image/png', 0.92);

    return {
      dataUrl,
      timestamp: Date.now(),
      sourceType: 'display_media',
      dimensions: { width, height },
    };
  } catch (error: any) {
    // Always clean up stream tracks if active
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    if (error.name === 'NotAllowedError') {
      throw new Error(
        'Screen capture permission was cancelled or denied. No screen content was captured.'
      );
    }
    throw error;
  }
}

/**
 * Read image file into ScreenCapture object
 */
export async function processImageFile(file: File): Promise<ScreenCapture> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file must be an image (PNG, JPEG, WebP).'));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        resolve({
          dataUrl,
          timestamp: Date.now(),
          sourceType: 'file_upload',
          dimensions: { width: img.naturalWidth, height: img.naturalHeight },
        });
      };
      img.onerror = () => reject(new Error('Failed to decode image file.'));
      img.src = dataUrl;
    };
    reader.onerror = () => reject(new Error('Failed to read file from disk.'));
    reader.readAsDataURL(file);
  });
}
