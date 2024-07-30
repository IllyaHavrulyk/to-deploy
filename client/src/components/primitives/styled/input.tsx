import styled from '@emotion/styled';

type Props = {
  fontSize: "x-large" | "large" | "medium";
  width?: number;
  isBold?: boolean;
};

const Input = styled.input<Props>`
  border-radius: 2px;
  animation-duration: 0.01s;
  animation-name: mui-auto-fill-cancel;
  border-color: rgba(0, 0, 0, 0.87);
  border-style: none;
  border-width: 1px;
  height: 30px;
  width: ${({ width }) => (width ? width + "px" : "250px")};
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ isBold }) => (isBold ? "bold" : "normal")};

  &:focus {
    outline: none;
  }
`;

export { Input };
