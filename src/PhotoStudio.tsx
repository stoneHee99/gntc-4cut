import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Frame } from './types.ts';

interface PhotoStudioProps {
  frame: Frame;
  onComplete: (photos: string[]) => void;
}

const PhotoStudio: React.FC<PhotoStudioProps> = ({ frame, onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState<boolean>(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  // useEffect(() => {
  //   const startWebcam = async () => {
  //     try {
  //       const stream = await navigator.mediaDevices.getUserMedia({
  //         video: {
  //           width: { ideal: frame.positions[0].width },
  //           height: { ideal: frame.positions[0].height }
  //         }
  //       });
  //       if (videoRef.current) {
  //         videoRef.current.srcObject = stream;
  //       }
  //     } catch (err) {
  //       console.error("Error accessing webcam: ", err);
  //     }
  //   };
  //
  //   startWebcam();
  // }, [frame.positions]);

  // useEffect(() => {
  //   const enumerateDevices = async () => {
  //     try {
  //       const devices = await navigator.mediaDevices.enumerateDevices();
  //       const videoDevices = devices.filter(device => device.kind === 'videoinput');
  //       setDevices(videoDevices);
  //       if (videoDevices.length > 0) {
  //         setSelectedDeviceId(videoDevices[0].deviceId);
  //       }
  //     } catch (err) {
  //       console.error("Error enumerating devices: ", err);
  //     }
  //   };
  //
  //   enumerateDevices();
  // }, []);

  useEffect(() => {
    const enumerateDevices = async () => {
      try {
        console.log("Enumerating devices...");
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        if (videoDevices.length > 0) {
          setDevices(videoDevices);
          setSelectedDeviceId(videoDevices[0].deviceId);
          console.log(`Found video devices: ${videoDevices.map(device => device.label).join(", ")}`);
          console.log(`Selected device ID: ${videoDevices[0].deviceId}`);
        } else {
          console.warn("No video devices found.");
        }
      } catch (err) {
        console.error("Error enumerating devices: ", err);
      }
    };

    enumerateDevices();
  }, []);

  useEffect(() => {
    const startWebcam = async () => {
      if (!selectedDeviceId) {
        console.warn("No device selected");
        return;
      }

      try {
        console.log(`Attempting to access webcam with device ID: ${selectedDeviceId}`);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedDeviceId,
            width: { ideal: frame.positions[0].width },
            height: { ideal: frame.positions[0].height },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log('Webcam stream started successfully');
        }

      } catch (err) {
        console.error("Error accessing webcam: ", err);
      }
    };

    startWebcam();
  }, [selectedDeviceId, frame.positions]);

  // useEffect(() => {
  //   const startWebcam = async () => {
  //     if (!selectedDeviceId) return;
  //
  //     try {
  //       const stream = await navigator.mediaDevices.getUserMedia({
  //         video: {
  //           deviceId: selectedDeviceId,
  //           width: { ideal: frame.positions[0].width },
  //           height: { ideal: frame.positions[0].height }
  //         }
  //       });
  //       if (videoRef.current) {
  //         videoRef.current.srcObject = stream;
  //       }
  //     } catch (err) {
  //       console.error("Error accessing webcam: ", err);
  //     }
  //   };
  //
  //   startWebcam();
  // }, [selectedDeviceId, frame.positions]);

  const takePhoto = useCallback(() => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.save();
        context.scale(1, 1); // 좌우 반전
        context.drawImage(videoRef.current, -canvasRef.current.width, 0, canvasRef.current.width, canvasRef.current.height);
        context.restore();
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const newPhoto = canvasRef.current.toDataURL('image/png');
        setPhotos(prevPhotos => [...prevPhotos, newPhoto]);
        setFlash(true);
        setTimeout(() => setFlash(false), 100); // 플래시 효과
      }
    }
  }, []);

  useEffect(() => {
    if (photos.length === frame.cutCount) {
      onComplete(photos);
    }
  }, [photos, frame.cutCount, onComplete]);

  const handleTakePhotoSequence = () => {
    setIsButtonDisabled(true);
    const takePhotoWithCountdown = (count: number) => {
      if (count > 0) {
        setCountdown(count);
        setTimeout(() => takePhotoWithCountdown(count - 1), 1000);
      } else {
        takePhoto();
        if (photos.length < frame.cutCount - 1) {
          setTimeout(() => takePhotoWithCountdown(10), 1000); // 다음 사진 촬영까지 1초 대기
        }
      }
    };

    takePhotoWithCountdown(10);
  };

  return (
      <div style={{
        position: 'relative',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <h1 style={{position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)'}}>↑
          카메라를 보세요 ↑</h1>
        <video ref={videoRef} autoPlay style={{
          width: 'auto',
          height: '80vh',
          objectFit: 'cover',
          transform: 'scaleX(-1)'
        }}/>
        <br/>
        <button onClick={handleTakePhotoSequence} disabled={isButtonDisabled} style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'black',
          borderRadius: '20px',
          color: 'white',
          padding: '10px 20px',
          fontFamily: 'LeeSeoyun'
        }}>사진 찍기 (10초마다 사진이 찍혀요)
        </button>
        <canvas ref={canvasRef} width={frame.positions[0].width} height={frame.positions[0].height}
                style={{display: 'none'}}/>
        {countdown !== null && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '96px',
              color: 'rgba(255, 255, 255, 0.7)',
              pointerEvents: 'none'
            }}>
              {countdown}
            </div>
        )}
        {flash && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'white',
              opacity: 0.8,
              pointerEvents: 'none'
            }}/>
        )}
        <select
            value={selectedDeviceId || ''}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            style={{
              position: 'absolute',
              top: '60px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '10px',
              fontSize: '16px'
            }}
        >
          {devices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId}`}
              </option>
          ))}
        </select>
      </div>
  );
};

export default PhotoStudio;