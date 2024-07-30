import { colors } from '@atlaskit/theme';
import styled from '@emotion/styled';

import { BORDER_RADIUS, SPACE_IN_PX } from '../../../common/constants/constants';

type Props = {
  isDragging: boolean;
};

const Container = styled.a<Props>`
  border-radius: ${BORDER_RADIUS}px;
  border: 2px solid transparent;
  background-color: ${colors.N0};
  box-sizing: border-box;
  padding: ${SPACE_IN_PX}px;
  min-height: 40px;
  margin-bottom: ${SPACE_IN_PX}px;
  user-select: none;

  color: ${colors.N900};

  &:hover,
  &:active {
    color: ${colors.N900};
    text-decoration: none;
  }

  &:focus {
    outline: none;
    border-color: ${colors.N400A};
    box-shadow: none;
  }

  display: flex;
`;

export { Container };
