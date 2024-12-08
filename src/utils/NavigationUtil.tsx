import {
  createNavigationContainerRef,
  CommonActions,
  StackActions,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

/**
 * Navigates to a specific route name with optional parameters.
 */
export function navigate(routeName: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.navigate({ name: routeName, params }));
  } else {
    console.error("Navigation reference is not ready. Cannot navigate.");
  }
}

/**
 * Replaces the current screen with a new one.
 */
export function replace(routeName: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(routeName, params));
  } else {
    console.error("Navigation reference is not ready. Cannot replace screen.");
  }
}

/**
 * Resets the navigation stack and navigates to a specific screen.
 */
export function resetAndNavigate(routeName: string) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName }],
      })
    );
  } else {
    console.error("Navigation reference is not ready. Cannot reset and navigate.");
  }
}

/**
 * Goes back to the previous screen in the navigation stack.
 */
export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.dispatch(CommonActions.goBack());
  } else {
    console.error("Navigation reference is not ready or there is no screen to go back to.");
  }
}

/**
 * Pushes a new screen onto the navigation stack.
 */
export function push(routeName: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(routeName, params));
  } else {
    console.error("Navigation reference is not ready. Cannot push screen.");
  }
}
