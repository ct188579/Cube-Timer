'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useTimer } from "../hooks/useTimer"
import { formatTime } from "../utils/formatTime"
import { Shuffle } from 'lucide-react'
import Image from "next/image"
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import { cn } from "@/lib/utils";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";
import ShinyButton from "@/components/ui/shiny-button";
import { useRouter } from 'next/navigation'
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

// 魔方打乱公式数组
const scrambles = [
  "L2 R2 F D' U R' D U L2 R D U2 B2 F L' D2 U L' R' U' L2 D U L' F",
  "L R D2 U' F D' U2 L2 R D U' B D2 R B L2 D' U' F U' L R' D' U' B",
  "L B2 L' R D' U L' D' B' D' L2 D2 L' R D U2 B F2 U B D F U L' R",
  "B L R' D' U F2 D' U B' F' U R D2 U B D2 F' U' L' D2 F2 U2 B2 U L",
  "D' R' U' L B' L R B' F2 U B2 D B' F' L2 D2 L2 D F2 R' D2 U' F2 R' D",
  "R2 U2 B' U' B' F L2 R2 B' U B' D2 U2 L D' U L' R' D U2 R D2 B2 R' D'",
  "B' L' R B2 D' U2 L' R B' F U2 L B' U' F2 U2 R B2 F' D2 L2 R D2 F2 L",
  "U2 L D' U2 F D2 U B' U' L' R' U L' D2 U2 F' R' F' R F' D2 L2 B2 F2 L'",
  "B2 L' R' D R' B2 U2 F2 L B2 F2 L2 B' L2 F2 U2 L R2 B F' U' R2 B2 D' L",
  "L2 D U2 B' F U2 B R U' L2 R' D2 B2 D2 U' B F2 R2 B' F L2 B' F' L R2",
  "L2 R2 B' D U2 B D' U R B' D U L R2 B2 D U2 B' L R' D' B' F' D U",
  "U B F2 D' U' B' D F' R B' D2 F2 D2 U L R2 F U' L R2 D R' D L2 R2",
  "B' D2 U' R2 D B' F2 L2 R B D' L2 D U L D2 U' B' F D' U R' B2 F2 R'",
  "R U L' R2 F' L B' U2 R B F D2 R2 F2 L D2 L2 R' D U' R' B F2 L2 R2",
  "F L D2 U F L2 R B L D' F2 D2 U2 L' B' F' R F' L R2 B' F2 D' U R",
  "D2 U' L' B' L2 F' U L' R' B F L' R D2 R' D2 U R2 B2 L' B F2 L2 R2 D2",
  "L B' D2 U B U' F L2 U2 F2 U2 B2 R U2 R' F U2 L B2 D' L2 R B' F2 L2",
  "U B' F2 D U2 B2 U B' F R' B R' F2 R' D2 U2 B F L R2 F' L' U F2 D",
  "B2 D2 U' F2 R' B U' B2 F' L' R2 D2 B2 U2 L2 R' B' F L R D' F L' F2 D'",
  "B2 F' L2 R' D2 U2 B' F L R' B L' D U2 B2 R2 D F2 D U R2 B' L2 D L'",
  "U2 B' F2 D2 B F D B F L2 R2 F R' D' B F2 D' U' L' D2 U B U2 B D",
  "B' R D' B' F2 L' F2 D' U L2 B2 R U' L' R' B2 F' L R D' B2 L' D' B2 F2",
  "F2 R2 B2 L D F L R2 B D L' R F' D2 B2 F2 R2 D' U2 F D2 U B' F' R",
  "R D U2 B' U2 L2 R D F D2 U' R D U2 B D2 F U' B' F L B2 R F2 R",
  "D U2 F2 D' F2 U L2 R D F' L2 R2 D' R F2 L D' F' R' D' L D U' L2 F'",
  "B F' L R2 F L R' U' B F D' U' L R U L' D2 R2 B2 F' L R' B2 F' D'",
  "B2 F2 L2 U R' U' L' F2 U' R D F R' B' L2 R' B2 D U F U' B' L' F' R",
  "R2 B' L D2 U' F D U2 F D2 L' U B' L2 R2 U R D U' L U2 R2 F' L' R2",
  "L' B' F L' U' R B2 L2 D2 U' L R' U' F' L R' D L2 R' U B2 F' D' L2 R",
  "L' B F D U' F D L2 R D2 U2 R' D2 F' L U2 B' F L2 D2 U B2 F D2 U'",
  "B' F2 L2 D U' L R' B' U B2 L' R F U F2 R2 B D B' R2 B2 F' L' B F'",
  "U2 R' B F R2 U' B U B R2 D U2 R D2 F2 U B F' D2 U' F L2 R2 D' U",
  "L R U B2 D2 L' D2 U L2 R2 F' L' R D' U2 B2 F2 R B F L R2 F' R2 B2",
  "F2 U2 F R F' D2 F' L R D' F' L R' D' L2 B2 F R F' D' F R' B' L' D",
  "L' R2 B' D' R2 U' R' D2 U' B U B' L2 D F2 D U' L D F2 L' F2 D2 L2 R2",
  "D F2 L2 R D U B2 F D2 U' B2 L' F2 D2 L2 R' U' L2 D' B' F' D' R B2 F2",
  "L2 R D U2 L' R2 D2 B2 U L U2 L' B R D2 U2 F U B2 L R D' B' F2 L",
  "U F D2 U B F L' R B R B' F' R B F' R' D2 R2 B2 F2 U F' D U B2",
  "B' L R D' U' B F' D2 L B2 D2 U' B F2 L R B F' U2 B F2 R2 B2 L2 R'",
  "L2 F D2 R2 B' L D2 U2 F L2 U' R' F' R2 D2 U2 F' D' B' L' R2 F' L' B' U'",
  "F2 U' B L R F L D U2 F L' D' L' R B U2 B2 U' F2 D2 U2 F' L' D' U'",
  "D U2 R2 B2 L B L2 B2 F U B2 L B F' D U' L' R D2 U2 B2 L' U B2 F",
  "L2 R2 B2 D2 U' L' R' B D' F2 L R F2 D' L B' F D2 B' L R B' F2 R F",
  "U2 L' R' B2 F D2 B' D L R' F' D2 U' R B2 F2 D2 U' F2 R D2 U2 B2 D U2",
  "D R D' R2 B2 U2 B' F L2 R' D U' F' D' U2 F2 R' B L R2 D F' D' R B2",
  "R' B2 F' D U' L2 U2 R B F' D U2 B F2 L' R' D2 L' B2 F' L2 D B' R' F",
  "R' D L' R2 D U R' B' R2 B' F' R' B' L' R B2 F' R B2 F' L2 D L R B2",
  "U2 R' F' U B F2 D' R B' L R' F2 R2 B2 F L2 R' D U B' F2 D' U L2 R",
  "B F' L R' D' U' B' L B F' U B2 F' L2 R' F2 U' L' R2 B' F' D U L' R",
  "B' R' D' B F' L' F L' D' R2 D' U' L2 R' D U2 L2 B2 D' U2 L R2 B2 D' B2"
]

export default function CubeTimer() {
  const { time, isRunning, start, pause, reset } = useTimer();
  const [currentScrambleIndex, setCurrentScrambleIndex] = useState(0);

  const nextScramble = () => {
    setCurrentScrambleIndex((prevIndex) => (prevIndex + 1) % scrambles.length);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        event.preventDefault(); // 防止页面滚动
        isRunning ? pause() : start();
      } else if (event.key.toLowerCase() === 'r') {
        reset();
        nextScramble();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRunning, start, pause, reset]);

  const router = useRouter()
  //点击按钮跳转博客
  const toBlog = () => {
    router.push('https://www.ctblog.top')
  }

  const words = [
    {
      text: "魔方如人生，每一次转动都是选择，每一次还原都是智慧。",
    },
    {
      text: "——我.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col">
      <header className="p-4 flex">
        <Image
          src="/avatar.png"
          alt="Cube Timer Logo"
          width={50}
          height={50}
          className="w-12 h-12 mr-3"
        />
        <div className="z-10 mt-3  items-center justify-center">
          <div
            className={cn(
              "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
            )}
          >
            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
              <span>✨ 陈涛のCube Timer</span>
            </AnimatedShinyText>
          </div>
        </div>
        <div className='ml-auto mt-3'>
          <ShinyButton onClick={toBlog}>click to my clog</ShinyButton>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center h-[15rem]  ">
        <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base  ">
          SMART CUBE TIMER DEVELOP BY CHENTAO
        </p>
        <TypewriterEffectSmooth words={words} />
      </div>

      <main className="flex-grow flex items-center justify-center mb-20">
        <NeonGradientCard className=" items-center justify-center text-center w-full max-w-2xl mx-auto">
          <div className="flex items-center justify-between w-full">
            <div className="text-2xl font-medium">{scrambles[currentScrambleIndex]}</div>
            <Button variant="outline" size="icon" onClick={nextScramble}>
              <Shuffle className="h-4 w-4" />
            </Button>
          </div>
          <div
            className="text-9xl font-bold tabular-nums"
            aria-live="polite"
          >
            {formatTime(time)}
          </div>
          <div className="flex gap-4 ml-52">
            <Button
              onClick={() => {
                reset();
                nextScramble();
              }}
              variant="outline"
              size="lg"
            >
              复位
            </Button>
            <Button
              onClick={isRunning ? pause : start}
              variant="default"
              size="lg"
            >
              {isRunning ? '暂停' : '开始'}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Press space to start/pause timing, press &apos;R&apos; to reset
          </p>
        </NeonGradientCard>

      </main>
    </div>
  )
}
