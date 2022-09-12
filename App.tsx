import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { clamp, snapPoint } from "react-native-redash";
import { data } from "./data";
import Item, { MAX_HEIGHT } from "./Item";

const snapPoints = data.map((_, i) => i * -MAX_HEIGHT);

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
  const onScroll = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { y: number }
  >({
    onStart: (_, context) => {
      context.y = y.value;
    },
    onActive: ({ translationY }, context) => {
      y.value = clamp(
        context.y + translationY,
        -(data.length - 1) * MAX_HEIGHT,
        0
      );
    },
    onEnd: ({ velocityY }) => {
      const dest = snapPoint(y.value, velocityY, snapPoints);
      y.value = withSpring(dest, { overshootClamping: true });
    },
  });
  if (!loaded) return null;
  return (
    <>
      <StatusBar hidden />
      <PanGestureHandler onGestureEvent={onScroll}>
        <Animated.View style={styles.container}>
          {data.map((item, index) => (
            <Item item={item} key={index} y={y} index={index} />
          ))}
        </Animated.View>
      </PanGestureHandler>
    </>
  );
}
