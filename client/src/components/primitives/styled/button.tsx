import styled from '@emotion/styled';

import { BORDER_RADIUS } from '../../../common/constants/constants';

const Button = styled.button`
  background-color: ${({ color }) => color};
  border-radius: ${BORDER_RADIUS}px;
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.1em;
  border: none;

  &:hover,
  &:focus {
    outline: none;
  }
`;

export { Button };
