import { useState } from "react"
import { useEffect } from "react";
export default function ClockCard() {
    const workObj = {min: 25, sec: 0};
    const restObj = {min: 5, sec: 0};
    const audio = new Audio("/alarm.mp3")
    const [time, setTime] = useState((workObj.min * 60 + workObj.sec) * 1000)
    const [formattedTime, setFormattedTime] = useState(new Date(time))
    const [active, setActive] = useState(false)
    const [rest, setRest] = useState(false)
    const resetTime = ({min, sec} = workObj) => setTime((min * 60 + sec) * 1000);
    const switchTime = () => {
        resetTime(rest ? restObj : workObj)
        setRest(t => !t)
    }
    const handleClick = () => setActive(t => { if (!t) { audio.play(); } return !t })
    useEffect(() => {
        setFormattedTime(new Date(time))
        if (active) {
            const interval = setInterval(() => {
                if(time == 0) {
                    switchTime() 
                    audio.play()
                } else setTime(t => t - 1000)
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [time, active])
    return (
        <div className="
            **:select-none
            min-h-screen flex flex-row justify-center items-center place-content-center min-w-screen 
            *:flex
            *:h-[75vh] *:w-[75vh] 
            *:mx-[2.5vw] *:my-[2.5vh] 
            *:bg-gray-700 *:rounded-xl *:text-[32rem] *:text-center
            *:items-center *:justify-center
            portrait:flex-col portrait:overflow-y-scroll 
            *:portrait:h-[40vh] *:portrait:w-[40vh]"
            onClick={handleClick}
        >
            <div className={!active ? "animate-pulse" : ""}>{formattedTime.getUTCMinutes().toString().padStart(2, '0')}</div>
            <div className={!active ? "animate-pulse" : ""}>{formattedTime.getUTCSeconds().toString().padStart(2, '0')}</div>
        </div>
    )
}