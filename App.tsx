import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { data } from "./data";
import Item, { MAX_HEIGHT } from "./Item";

export default function App() {
  const styles = StyleSheet.create({
    container: {
      height: (data.length + 1) * MAX_HEIGHT,
      backgroundColor: "black",
    },
  });

  const [loaded] = useFonts({
    "Cormorant-Light": require("./fonts/Cormorant-Light.ttf"),
    "Cormorant-Medium": require("./fonts/Cormorant-Medium.ttf"),
    "Cormorant-Regular": require("./fonts/Cormorant-Regular.ttf"),
    "Cormorant-SemiBold": require("./fonts/Cormorant-SemiBold.ttf"),
    "Cormorant-Bold": require("./fonts/Cormorant-Bold.ttf"),
  });
  const y = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y: value } }) => {
      y.value = value;
    },
  });
  if (!loaded) return null;
  return (
    <>
      <StatusBar hidden />
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.container}
        snapToInterval={MAX_HEIGHT}
        decelerationRate="fast"
      >
        <Animated.View style={styles.container}>
          {data.map((item, index) => (
            <Item item={item} key={index} y={y} index={index} />
          ))}
        </Animated.View>
      </Animated.ScrollView>
    </>
  );
}
