export interface Frame {
  id: string;
  name: string;
  cutCount: number;
  width: number;
  height: number;
  positions: { x: number; y: number; width: number; height: number; angle: number }[];
  frameImage: string;
}

export const frames: Frame[] = [
  {
    id: 'frame1',
    name: '대형 1',
    cutCount: 4,
    width: 864,
    height: 1296,
    positions: [
      {x: 45, y: 300, width: 370, height: 450, angle: 0},
      {x: 45, y: 765, width: 370, height: 450, angle: 0},
      {x: 450, y: 90, width: 370, height: 450, angle: 0},
      {x: 450, y: 550, width: 370, height: 450, angle: 0}
    ],
    frameImage: '/frames/frame1.png',
  },
  {
    id: 'frame2',
    name: '대형 2',
    cutCount: 4,
    width: 864,
    height: 1296,
    positions: [
      {x: 25, y: 50, width: 400, height: 520, angle: 0},
      {x: 440, y: 50, width: 400, height: 520, angle: 0},
      {x: 25, y: 595, width: 400, height: 520, angle: 0},
      {x: 440, y: 595, width: 400, height: 520, angle: 0}
    ],
    frameImage: '/frames/frame2.png',
  },
  {
    id: 'frame3',
    name: '소형 1',
    cutCount: 4,
    width: 432,
    height: 1296,
    positions: [
      {x: 25, y: 28, width: 390, height: 260, angle: 0},
      {x: 25, y: 306, width: 390, height: 260, angle: 0},
      {x: 25, y: 585, width: 390, height: 260, angle: 0},
      {x: 25, y: 864, width: 390, height: 260, angle: 0}
    ],
    frameImage: '/frames/frame3.png'
  },
  {
    id: 'frame4',
    name: '소형 2',
    cutCount: 3,
    width: 432,
    height: 1296,
    positions: [
      {x: 25, y: 115, width: 390, height: 265, angle: 0 },
      {x: 25, y: 395, width: 390, height: 265, angle: 0 },
      {x: 25, y: 677
        , width: 390, height: 265, angle: 0 }
    ],
    frameImage: '/frames/frame4.png'
  }
]
