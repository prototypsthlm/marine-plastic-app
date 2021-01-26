import React, { FC } from "react";
import { TextInputProps } from "react-native";
import styled from "../styled";

export interface InputFieldProps extends TextInputProps {
  style?: TextInputProps;
  disabled?: boolean;
  label?: string;
  preset?: InputPresetName;
  stylePreset?: StylePresetName;
  togglePassword?: boolean;
  error?: string;
}

interface StyledProps {
  preset?: StylePresetName;
  disabledStyle?: boolean;
  error?: boolean;
}

export const InputField: FC<InputFieldProps> = ({
  style,
  label,
  disabled = false,
  preset = "default",
  stylePreset = "default",
  togglePassword = false,
  error,
  ...rest
}) => {
  const textInputProps = {
    ...presets[preset],
    ...rest,
  };
  return (
    <Container disabledStyle={disabled} preset={stylePreset}>
      <Label preset={stylePreset}>{label}</Label>
      <InputWrapper error={Boolean(error)} preset={stylePreset}>
        <StyledTextInput
          preset={stylePreset}
          style={style}
          {...textInputProps}
          editable={!disabled}
        />
      </InputWrapper>
      <Error preset={stylePreset}>{error}</Error>
    </Container>
  );
};

const presets = {
  default: { autoCorrect: false },
  email: {
    autoCapitalize: "none",
    autoCompleteType: "email",
    autoCorrect: false,
    textContentType: "username",
    keyboardType: "email-address",
  } as TextInputProps,
  password: {
    autoCapitalize: "none",
    autoCompleteType: "password",
    autoCorrect: false,
    secureTextEntry: true,
    textContentType: "password",
  } as TextInputProps,
};

const Container = styled.View<StyledProps>`
  opacity: ${(p) => (p.disabledStyle ? 0.6 : 1)};
  align-content: flex-start;
  height: 80px;
  margin-vertical: ${(p) => p.theme.spacing.small}px;
`;

const InputWrapper = styled.View<StyledProps>`
  align-items: center;
  flex-direction: row;
  padding-left: ${(p) => (p.preset === "rounded" ? 16 : 0)}px;
  padding-right: ${(p) => (p.preset === "rounded" ? 13 : 0)}px;
  background-color: ${(p) =>
    p.preset === "rounded"
      ? !p.error
        ? "rgba(255,255,255,0.5)"
        : "white"
      : "transparent"};
  border-radius: ${(p) => (p.preset === "rounded" ? 999 : 0)}px;
`;

const StyledTextInput = styled.TextInput<StyledProps>`
  flex: 1;
  font-size: ${(props) => props.theme.fontSize.medium}px;
  font-family: ${(props) => props.theme.typography.primary};
  height: 44px;
  line-height: 19px;
  color: ${(p) => p.theme.color.palette.black};
  border-bottom-color: ${(p) => p.theme.color.palette.black};
  border-bottom-width: ${(p) => (p.preset === "rounded" ? 0 : 1)}px;
`;

const Error = styled.Text<StyledProps>`
  color: ${(p) => p.theme.color.palette.black};
  font-size: ${(props) => props.theme.fontSize.small}px;
  font-family: ${(props) => props.theme.typography.primary};
  line-height: 17px;
  margin-top: ${(p) => p.theme.spacing.tiny}px;
  margin-left: ${(p) => (p.preset === "rounded" ? 22 : 0)}px;
`;

const Label = styled.Text<StyledProps>`
  color: ${(p) => p.theme.color.palette.black};
  margin-bottom: ${(p) =>
    p.preset === "codeInput" ? 0 : p.theme.spacing.small}px;
  margin-left: ${(p) => (p.preset === "rounded" ? 22 : 0)}px;
  font-size: ${(p) =>
    p.preset === "rounded" || p.preset === "codeInput" ? 14 : 10}px;
  line-height: ${(p) =>
    p.preset === "rounded" || p.preset === "codeInput" ? 17 : 12}px;
`;

export type StylePresetName = "default" | "rounded" | "codeInput";
export type InputPresetName = keyof typeof presets;

export default InputField;
