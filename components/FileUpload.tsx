import { parseStringArt } from '@/lib/parser';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import React, { useCallback, useState } from 'react';
import { Alert, View } from 'react-native';
import { useFileContext } from './context/FileContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Text } from './ui/text';

// Types

  interface PickedAsset {
    uri: string;
    name?: string | null;
  }



const FileUpload = () => {
  const { setPoints } = useFileContext();

  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [numPoints, setNumPoints] = useState(0);
  const [numLines, setNumLines] = useState(0);
  const [warnings, setWarnings] = useState<string[]>([]);


  const resetLocalState = useCallback(() => {
    setFileName('');
    setNumPoints(0);
    setNumLines(0);
    setWarnings([]);
  }, []);

  const clearAll = useCallback(() => {
    resetLocalState();
    setPoints([]);
  }, [resetLocalState, setPoints]);

  const pickDocumentAsset = useCallback(async (): Promise<PickedAsset | null> => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'text/*',
      copyToCacheDirectory: true,
    });

    if (result.canceled) return null;
    const asset = result.assets?.[0];
    if (!asset?.uri) return null;

    return { uri: asset.uri, name: asset.name };
  }, []);

  const readTextFile = useCallback(async (uri: string): Promise<string> => {
    return FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.UTF8 });
  }, []);

  const parseAndApply = useCallback(
    (content: string, name?: string | null) => {
      const parsed = parseStringArt(content);

      // Always set what we can; warnings are shown even if counts mismatch
      setFileName(name || 'Unknown file');
      setPoints(parsed.points);
      setNumPoints(parsed.numPoints ?? 0);
      setNumLines(parsed.numLines ?? 0);
      setWarnings(parsed.warnings);
    },
    [setPoints]
  );

  const pickDocument = useCallback(async () => {
    try {
      setIsLoading(true);

      const asset = await pickDocumentAsset();
      if (!asset) return;

      const content = await readTextFile(asset.uri);
      parseAndApply(content, asset.name);
    } catch (error) {
      Alert.alert('Error', 'Failed to read the file. Please try again.');
      console.error('File selection or read error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [pickDocumentAsset, readTextFile, parseAndApply]);



  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex-row">
        <View className="flex-1 gap-1.5">
          <CardTitle>File Upload</CardTitle>
          <CardDescription>
            {fileName ? `clear to replace file` : 'Upload a text file'}
          </CardDescription>
        </View>

        <View className="flex-1 gap-1.5">
          {fileName && (
            <View className="gap-2">
              {/* Main Controls */}
              <View className="flex-row gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onPress={clearAll}
                  accessibilityLabel="Clear file and parsed data"
                >
                  <Text>🗑️ Clear</Text>
                </Button>
              </View>
            </View>
          )}
        </View>
      </CardHeader>

      <CardContent>
        <View className="w-full justify-center gap-4">
          <View className="gap-2">
            <Text className="text-sm text-gray-600">
              {fileName ? `Selected: ${fileName}` : 'No file selected'}
            </Text>
          </View>

          {fileName && (
            <View className="gap-2">
              <Text className="text-sm text-gray-600">Number of points: {numPoints ?? '—'}</Text>
              <Text className="text-sm text-gray-600">Number of lines: {numLines ?? '—'}</Text>

              {warnings.map((w, i) => (
                <Text key={`${w}-${i}`} className="text-sm text-red-600">
                  {w}
                </Text>
              ))}
            </View>
          )}
        </View>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        {!fileName && (
          <Button
            className="w-full"
            onPress={pickDocument}
            disabled={isLoading}
            accessibilityLabel="Select a text file to upload"
          >
            <Text>{isLoading ? 'Loading...' : 'Select Text File'}</Text>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};



export default FileUpload;