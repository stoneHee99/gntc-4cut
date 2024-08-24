import React from 'react'
import photoTitle from './assets/photoTitle.png';
import "./TitleScreen.css";

interface TitleScreenProps {
  onStart: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  return (
      <div className="title-box" onClick={onStart}>
        <img className="title-image" src={photoTitle} alt="title-image"/>
        <p className="floating-text">화면을 클릭하면 시작됩니다!</p>
      </div>
  )
}

export default TitleScreen;