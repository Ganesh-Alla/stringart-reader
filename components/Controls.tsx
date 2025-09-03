
import { numberToWords } from "amount-to-words";
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef } from 'react';
import { View } from "react-native";
import { useControlContext } from "./context/ControlContext";
import { useFileContext } from "./context/FileContext";
import { useSpeechContext } from "./context/SpeechContext";
import { Button } from "./ui/button";
import { NativeSelectScrollView, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { Text } from "./ui/text";

const Controls = () => {
    const { isPlaying, setIsPlaying, speechLang, setSpeechLang, delayMs, setDelayMs } = useSpeechContext();
    const { currentPointIndex, setCurrentPointIndex } = useControlContext();
    const { points } = useFileContext();

    const isUnmountedRef = useRef<boolean>(false);
    const isPlayingRef = useRef<boolean>(false);
    const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pointsLengthRef = useRef<number>(0);

    const scheduleNextAdvance = useCallback(() => {
        if (advanceTimeoutRef.current) {
          clearTimeout(advanceTimeoutRef.current);
          advanceTimeoutRef.current = null;
        }
    
        const wait = parseInt(delayMs?.value || '3000', 10);
        if (isUnmountedRef.current || !isPlayingRef.current) return;
        advanceTimeoutRef.current = setTimeout(() => {
          if (isUnmountedRef.current || !isPlayingRef.current) return;
          setCurrentPointIndex((prev: number) => {
            const next = prev + 1;
            if (next >= pointsLengthRef.current) {
              setIsPlaying(false); // stop at end
              return prev;
            }
            return next;
          });
        }, wait);
      }, [delayMs, setCurrentPointIndex, setIsPlaying]);

    const speakAtIndex = useCallback((index: number) => {
        if (!points.length) return;
        const toSpeak = speechLang === 'en-US' ? numberToWords(points[index]) : String(points[index]);
        Speech.stop();
        Speech.speak(toSpeak, {
          language: speechLang,
          onDone: () => {
            if (isUnmountedRef.current) return;
            if (!isPlayingRef.current) return;
            scheduleNextAdvance();
          },
          onStopped: () => {},
          onError: () => {},
        });
      }, [ points, scheduleNextAdvance, speechLang]);

      useEffect(() => {
          setIsPlaying(false);
          Speech.stop();
          setCurrentPointIndex(0);
          if (advanceTimeoutRef.current) {
              clearTimeout(advanceTimeoutRef.current);
              advanceTimeoutRef.current = null;
            }
            pointsLengthRef.current = points.length;
      }, [points, setCurrentPointIndex, setIsPlaying]);

     // Drive TTS when playing or when index changes
  useEffect(() => {
    isPlayingRef.current = isPlaying;
    if (!isPlaying) return;
    speakAtIndex(currentPointIndex);
  }, [isPlaying, currentPointIndex, speakAtIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;
      Speech.stop();
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
        advanceTimeoutRef.current = null;
      }
    };
  }, []);


    const handlePrev = () => {
        setIsPlaying(false);
        if (currentPointIndex > 0) {
            const next = currentPointIndex - 1;
            setCurrentPointIndex(next);
            Speech.stop();
        }
    }
    const handleNext = () => {
        setIsPlaying(false);
        if (currentPointIndex < points.length - 1) {
            const next = currentPointIndex + 1;
            setCurrentPointIndex(next);
            Speech.stop();
        }
    }
    const handlePlay = () => {
        setIsPlaying(true);
        // Speech.speak(points[currentPointIndex]);
    }
    const handlePause = () => {
        setIsPlaying(false);
        Speech.stop();
    }
    const handleStop = () => {
        setIsPlaying(false);
        Speech.stop();
    }
    return (
        <View className="w-full gap-4">
            <View className="flex-row gap-2 w-full">
                <Button
                    variant="outline"
                    className="flex-1"
                    onPress={handlePrev}
                >
                    <Text>◀ Prev</Text>
                </Button>
                <Button
                    variant="outline"
                    className="flex-1"
                    onPress={handleNext}
                >
                    <Text>Next ▶</Text>
                </Button>
            </View>
            <View className="flex-row gap-2">
                {!isPlaying ? (
                    <Button className="flex-1" onPress={handlePlay}>
                        <Text>▶ Start</Text>
                    </Button>
                ) : (
                    <Button variant="outline" className="flex-1" onPress={handlePause}>
                        <Text>⏸ Pause</Text>
                    </Button>
                )}
                <Button variant="outline" className="flex-1" onPress={handleStop}>
                    <Text>⏹ Stop</Text>
                </Button>
            </View>
            <View className="flex-row gap-2">
                <Button
                    variant={speechLang === 'en-US' || speechLang === 'te-IN' ? undefined : 'outline'}
                    className="flex-1"
                    onPress={() => setSpeechLang(speechLang === 'en-US' ? 'te-IN' : 'en-US')}
                >
                    <Text>{speechLang === 'en-US' ? 'EN' : 'తెలుగు'}</Text>
                </Button>

                <Select value={delayMs} onValueChange={setDelayMs}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select delay time" />
                    </SelectTrigger>
                    <SelectContent className="w-[180px]">
                        <NativeSelectScrollView>
                            <SelectGroup>
                                <SelectLabel>Delay</SelectLabel>
                                <SelectItem label="3 seconds" value="3000">3 seconds</SelectItem>
                                <SelectItem label="4 seconds" value="4000">4 seconds</SelectItem>
                                <SelectItem label="5 seconds" value="5000">5 seconds</SelectItem>
                                <SelectItem label="6 seconds" value="6000">6 seconds</SelectItem>
                                <SelectItem label="7 seconds" value="7000">7 seconds</SelectItem>
                                <SelectItem label="8 seconds" value="8000">8 seconds</SelectItem>
                                <SelectItem label="9 seconds" value="9000">9 seconds</SelectItem>
                                <SelectItem label="10 seconds" value="10000">10 seconds</SelectItem>
                            </SelectGroup>
                        </NativeSelectScrollView>
                    </SelectContent>
                </Select>
            </View>
        </View>
    )
}

export default Controls