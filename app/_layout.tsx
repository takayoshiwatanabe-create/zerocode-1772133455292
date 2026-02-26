import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ title: "ミステリーアドベンチャー～セカイを旅するお仕事図鑑～" }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
