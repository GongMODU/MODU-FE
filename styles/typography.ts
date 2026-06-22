import { type TextStyle } from "react-native";
import { fonts } from "./fonts";

export const typography: Record<string, TextStyle> = {
  largeTitleMedium20: {
    fontFamily: fonts.medium,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -1.4,
  },
  subtitleMedium14: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18.2,
  },
  footerBold12: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 15.6,
  },
  bodyMedium11: {
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 14.3,
  },
  bodyRegular11: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14.3,
  },
  labelMedium10: {
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 13,
  },
  bodyRegular10: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 13,
  },
  captionMedium9: {
    fontFamily: fonts.medium,
    fontSize: 9,
    lineHeight: 11.7,
  },
  captionRegular9: {
    fontFamily: fonts.regular,
    fontSize: 9,
    lineHeight: 11.7,
  },
  captionMedium8: {
    fontFamily: fonts.medium,
    fontSize: 8,
    lineHeight: 10.4,
  },
};
