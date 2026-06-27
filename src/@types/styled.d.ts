import "styled-components"
import theme from "../styles/theme"

declare module "styled-components" {
  type ThemeType = typeof theme

  // styled-components requires an interface for theme augmentation.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends ThemeType {}
}
