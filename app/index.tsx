import { ControlProvider } from '@/components/context/ControlContext';
import { useFileContext } from '@/components/context/FileContext';
import { SpeechProvider } from '@/components/context/SpeechContext';
import FileUpload from '@/components/FileUpload';
import PointDisplay from '@/components/PointDisplay';
import { View } from 'react-native';

export default function HomeScreen() {
  const { hasFile } = useFileContext();
  return (
    <View className="flex items-center h-full p-4">
    <SpeechProvider>  
    <ControlProvider>
    <FileUpload />
    {hasFile && 
      <PointDisplay />
    }
    </ControlProvider>
    </SpeechProvider>
  </View>
  );
}


