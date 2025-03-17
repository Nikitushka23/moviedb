import { FlatList, type FlatListProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = FlatListProps<any> & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedFlatList({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <FlatList style={[{ backgroundColor }, style]} {...otherProps} />;
}
