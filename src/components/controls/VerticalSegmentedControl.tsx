import React from "react";
import styled from "../../styled";

interface VerticalSegmentedControlProps {
  style?: any;
  items?: Array<{ label: string; value: string | undefined }>;
  selectedItem?: string;
  onChange?: (selectedItem: string | undefined) => void;
}

const VerticalSegmentedControl = ({
  style,
  items,
  selectedItem,
  onChange,
}: VerticalSegmentedControlProps) => (
  <StyledControlContainer style={style}>
    {items &&
      items.map((item, i) => (
        <VerticalSegmentedControlButton
          key={i}
          onPress={() => onChange && onChange(item.value)}
          isSelected={item.value === selectedItem}
          isLast={i === items.length - 1}
        >
          {item.label}
        </VerticalSegmentedControlButton>
      ))}
  </StyledControlContainer>
);

interface ButtonProps {
  children: any;
  isSelected: boolean;
  isLast: boolean;
  onPress?: () => void;
}

const VerticalSegmentedControlButton = ({
  children,
  isSelected,
  isLast,
  onPress,
}: ButtonProps) => (
  <StyledButton
    onPress={onPress}
    style={{
      marginBottom: isLast ? 0 : 5,
      backgroundColor: isSelected ? "white" : "#e3e3e4",
    }}
  >
    {children}
  </StyledButton>
);

const StyledButton = ({ onPress, children, style }: any) => (
  <StyledButtonContainer onPress={onPress} style={style}>
    <StyledButtonText>{children}</StyledButtonText>
  </StyledButtonContainer>
);

const StyledControlContainer = styled.View``;

const StyledButtonContainer = styled.TouchableOpacity`
  background-color: #e3e3e4;
  border-radius: 5px;
  padding: 10px;
`;

const StyledButtonText = styled.Text`
  align-self: center;
`;

export default VerticalSegmentedControl;
