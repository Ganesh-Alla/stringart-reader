import Slider from '@react-native-community/slider';
import { View } from "react-native";
import { useControlContext } from "./context/ControlContext";
import { useFileContext } from "./context/FileContext";
import { useSpeechContext } from './context/SpeechContext';
import { Text } from "./ui/text";

const NumberDisplay = () => {
    const { points } = useFileContext();
    const { currentPointIndex, setCurrentPointIndex } = useControlContext();
    const { setIsPlaying } = useSpeechContext();
    return (
        <View className="gap-4">
            <View className="items-center">
                <Text className="text-3xl font-bold text-blue-600">
                    {points.length ? points[currentPointIndex] : '—'}
                </Text>
            </View>
            <View className="items-center gap-2">
                <Text className="text-sm text-gray-600">
                    {points.length > 0 ? `${currentPointIndex + 1} / ${points.length}` : '—'}
                </Text>
                {/* Custom slider for jumping to index */}
                <Slider
                    value={currentPointIndex + 1}
                    onValueChange={(value) => {
                        const index = Math.max(0, Math.min(points.length - 1, Math.round(value) - 1));
                        setCurrentPointIndex(index);
                    }}
                    step={1}
                    style={{ width: '100%', height: 40 }}
                    minimumValue={1}
                    maximumValue={points.length}
                    minimumTrackTintColor="#1e3a8a"
                    maximumTrackTintColor="#2563eb"
                    disabled={!points.length}
                />
            </View>
            </View>
        )
}

export default NumberDisplay;