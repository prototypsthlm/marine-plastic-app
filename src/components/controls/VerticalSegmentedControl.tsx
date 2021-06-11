import React from "react";
import styled from "../../styled";

interface VerticalSegmentedControlProps {
  style?: any;
  items?: Array<string>;
  selectedItemIndex?: number;
  onChange?: (selectedItemIndex: number) => void;
}

const VerticalSegmentedControl = ({ style, items, selectedItemIndex, onChange }: VerticalSegmentedControlProps) => (
  <StyledControlContainer style={style}>
    {items && items.map((item, i) =>
      <VerticalSegmentedControlButton
        key={i}
        onPress={() => onChange && onChange(i)}
        isSelected={i === selectedItemIndex}
        isLast={i === items.length - 1}
      >
        {item}
      </VerticalSegmentedControlButton>
    )}
  </StyledControlContainer>
);

interface ButtonProps {
  children: any;
  isSelected: boolean;
  isLast: boolean;
  onPress?: () => void;
}

const VerticalSegmentedControlButton = ({ children, isSelected, isLast, onPress }: ButtonProps) => (
  <StyledButton
    onPress={onPress}
    style={{
      marginBottom: isLast ? 0 : 5,
      backgroundColor: isSelected ? "white" : "#e3e3e4"
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
  backgroundColor: #e3e3e4;
  borderRadius: 5px;
  padding: 10px;
`;

const StyledButtonText = styled.Text`
  alignSelf: center;
`;

export default VerticalSegmentedControl;
