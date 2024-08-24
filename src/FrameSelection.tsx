import React, {useEffect, useState} from 'react';
import Slider from 'react-slick';
import { Frame } from "./types.ts";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface FrameSelectionProps {
  frames: Frame[];
  onSelect: (frame: Frame) => void;
}

const FrameSelection: React.FC<FrameSelectionProps> = ({ frames, onSelect }) => {

  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);

  useEffect(() => {
    if (frames.length > 0) setSelectedFrame(frames[0]);
  }, [frames]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index: number) => setSelectedFrame(frames[index])
  };

  const handleSelectClick = () => {
    if (selectedFrame) onSelect(selectedFrame);
  };

  return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>슬라이드 해서 프레임을 선택하세요!</h1>
        <Slider {...settings}>
          {frames.map((frame) => (
              <div key={frame.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px'}}>
                <img src={frame.frameImage} alt={frame.name} style={{ height: '80vh', margin: '0 auto'}}/>
              </div>
          ))}
        </Slider>
        <button onClick={handleSelectClick} style={{ marginTop: '40px', borderRadius: '20px', border: 'none', padding: '10px 20px', backgroundColor: 'black', color: 'white', fontFamily: 'LeeSeoyun'}}>
          선택완료
        </button>
      </div>
  );
};

export default FrameSelection;
