import React, {useEffect, useRef, useState} from 'react';
import { Frame } from './types.ts'
import { saveAs } from 'file-saver';
import { v4 as uuidv4 } from 'uuid';

interface PhotoDisplayProps {
  photos: string[];
  frame: Frame;
}

const PhotoDisplay: React.FC<PhotoDisplayProps> = ({ photos, frame  }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (photos.length === frame.cutCount) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      photos.forEach((photo, index) => {
        const img = new Image();
        img.src = photo;
        img.onload = () => {
          context.save();
          context.translate(frame.positions[index].x + frame.positions[index].width / 2, frame.positions[index].y + frame.positions[index].height / 2);
          context.rotate(frame.positions[index].angle);
          context.scale(-1, 1);
          context.drawImage(img, -frame.positions[index].width / 2, -frame.positions[index].height / 2, frame.positions[index].width, frame.positions[index].height);
          context.restore();
        }
      });

      const frameImage = new Image();
      frameImage.src = frame.frameImage;

      frameImage.onload = () => {
        context.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
      };
    }
  }, [photos, frame]);

  const handleSave = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    const blob = dataURLToBlob(dataUrl);
    const uniqueFileName = `${fileName}_${uuidv4()}.png`;

    saveAs(blob, uniqueFileName);
  };

  const handleRetake = () => {
    window.location.reload();
  }

  const dataURLToBlob = (dataURL: string) => {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
      <div style={{textAlign: 'center'}}>
        <h1>사진 촬영 완료</h1>
        <canvas ref={canvasRef} width={frame.width} height={frame.height}
                style={{border: '1px solid black', maxWidth: '80%'}}/>
        <div style={{marginTop: '20px'}}>
          <input
              type="text"
              placeholder="사진을 전달받을 이메일이나 번호를 남겨주세요"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              style={{padding: '10px', fontSize: '30px', fontFamily: 'LeeSeoyun', marginTop: '20px', marginBottom: '30px',
                border: 'none',
                borderBottom: '2px solid black',
                backgroundColor: 'transparent',
                outline: 'none',
                width: '60%'
              }}
          />
          <br/>
          <button onClick={handleSave}
                  style={{padding: '10px 20px', fontSize: '16px', marginRight: '10px', backgroundColor: 'black', borderRadius: '20px', color: 'white', fontFamily: 'LeeSeoyun'}}>
            저장하기
          </button>
          <button onClick={handleRetake} style={{padding: '10px 20px', fontSize: '16px', backgroundColor: 'black', borderRadius: '20px', color: 'white', fontFamily: 'LeeSeoyun'}}>
            처음부터 다시 찍기
          </button>
        </div>
      </div>
  );
};

export default PhotoDisplay;