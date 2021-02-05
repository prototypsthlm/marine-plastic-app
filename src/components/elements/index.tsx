import styled from "../../styled";

export const ListItem = styled.TouchableOpacity`
  background-color: ${(p) => p.theme.color.background};
  border-bottom-color: ${(p) => p.theme.color.palette.gray};
  margin-bottom: 1px;
  padding: ${(props) => props.theme.spacing.small}px
    ${(props) => props.theme.spacing.medium}px;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
`;

export const Section = styled.View`
  background-color: ${(props) => props.theme.color.background};
  padding: ${(props) => props.theme.spacing.medium}px;
  width: 100%;
`;

export const FlexColumn = styled.View`
  flex-direction: column;
  justify-content: space-between;
`;

export const Text = styled.Text<{ bold?: boolean }>`
  font-family: ${(props) =>
    props.bold
      ? props.theme.typography.primaryBold
      : props.theme.typography.primary};
  font-size: ${(props) => props.theme.fontSize.medium}px;
`;
