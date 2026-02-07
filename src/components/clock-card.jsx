import { useState, useEffect, useRef } from "react";

export default function ClockCard() {
    const workObj = {min: 25, sec: 0};
    const restObj = {min: 5, sec: 0};

    // Audio refs for different sounds
    const audioRef = useRef(null);

    const [time, setTime] = useState((workObj.min * 60 + workObj.sec) * 1000)
    const [formattedTime, setFormattedTime] = useState(new Date(time))
    const [active, setActive] = useState(false)
    const [rest, setRest] = useState(false)

    // Initialize audio on mount and cleanup on unmount
    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.preload = "auto";
        audioRef.current.volume = 0.1; // Set volume to 50%

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
                audioRef.current = null;
            }
        };
    }, []);

    // Play sound with error handling
    const playSound = async (soundFile) => {
        try {
            if (audioRef.current) {
                // Reset audio to beginning and change source
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current.src = soundFile;
                await audioRef.current.play();
            }
        } catch (error) {
            console.warn("Audio play failed:", error);
            // Silently fail - user might have autoplay disabled
        }
    };

    const resetTime = ({min, sec} = workObj) => setTime((min * 60 + sec) * 1000);

    const switchTime = () => {
        resetTime(rest ? restObj : workObj)
        setRest(t => !t)
    }

    const handleClick = () => {
        setActive(t => {
            if (!t) {
                playSound("/alarm.mp3"); // Play start sound
            }
            return !t;
        });
    }

    useEffect(() => {
        setFormattedTime(new Date(time))
        if (active) {
            const interval = setInterval(() => {
                if(time == 0) {
                    switchTime();
                    playSound("/alarm.mp3"); // Play alarm sound when timer completes
                } else setTime(t => t - 1000)
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [time, active])
    return (
        <div className="
            **:select-none
            min-h-screen flex flex-col justify-center items-center place-content-center min-w-screen
            bg-black transition-all duration-700 ease-in-out
        ">
            {/* Mode Indicator */}
            <div className={`
                text-2xl font-semibold mb-8 px-8 py-3 rounded-full
                border-2 transition-all duration-500
                ${!active
                    ? 'text-white border-gray-400 bg-gray-700/80 backdrop-blur-md shadow-lg shadow-gray-500/30'
                    : 'text-white border-gray-500 bg-gray-800/80 backdrop-blur-md shadow-lg shadow-gray-700/30'}
            `}>
                {!active ? 'Rest Time' : 'Focus Time'}
            </div>

            {/* Clock Display */}
            <div
                className="
                    flex flex-row gap-6 items-center justify-center
                    cursor-pointer group
                    portrait:flex-row portrait:gap-3
                "
                onClick={handleClick}
            >
                {/* Minutes */}
                <div className={`
                    flex items-center justify-center
                    h-[50vh] w-[35vw] max-w-[400px] max-h-[400px]
                    rounded-3xl
                    text-[12rem] font-bold text-center
                    border-4 border-gray-600
                    bg-gray-900/80 backdrop-blur-xl
                    text-white
                    transition-all duration-500 ease-in-out
                    transform hover:scale-105 active:scale-95
                    shadow-2xl shadow-gray-900/50
                    hover:border-gray-400
                    ${!active ? 'animate-pulse' : ''}
                    portrait:h-[30vh] portrait:w-[35vw] portrait:text-[8rem] portrait:rounded-2xl
                `}>
                    {formattedTime.getUTCMinutes().toString().padStart(2, '0')}
                </div>

                {/* Colon Separator */}
                <div className={`
                    text-8xl font-bold text-gray-400
                    transition-all duration-500
                    ${!active ? 'animate-pulse' : 'animate-bounce'}
                    portrait:text-5xl
                `}>
                    :
                </div>

                {/* Seconds */}
                <div className={`
                    flex items-center justify-center
                    h-[50vh] w-[35vw] max-w-[400px] max-h-[400px]
                    rounded-3xl
                    text-[12rem] font-bold text-center
                    border-4 border-gray-600
                    bg-gray-900/80 backdrop-blur-xl
                    text-white
                    transition-all duration-500 ease-in-out
                    transform hover:scale-105 active:scale-95
                    shadow-2xl shadow-gray-900/50
                    hover:border-gray-400
                    ${!active ? 'animate-pulse' : ''}
                    portrait:h-[30vh] portrait:w-[35vw] portrait:text-[8rem] portrait:rounded-2xl
                `}>
                    {formattedTime.getUTCSeconds().toString().padStart(2, '0')}
                </div>
            </div>

            {/* Status Indicator */}
            <div className={`
                text-lg font-medium mt-8 px-6 py-2 rounded-full
                backdrop-blur-md transition-all duration-300
                border-2
                ${active
                    ? 'text-white bg-gray-700/80 border-gray-400'
                    : 'text-gray-400 bg-gray-800/80 border-gray-600'}
            `}>
                {active ? '▶ Running' : '⏸ Paused - Click to Start'}
            </div>
        </div>
    )
}
