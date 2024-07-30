import { colors } from "@atlaskit/theme";
import styled from "@emotion/styled";
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";

import { BORDER_RADIUS } from "../../../common/constants/constants";

type Props = (DraggableProvidedDragHandleProps | object) & {
  isDragging: boolean;
};

const Header = styled.div<Props>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: ${BORDER_RADIUS}px;
  border-top-right-radius: ${BORDER_RADIUS}px;
  background-color: ${({ isDragging }) =>
    isDragging ? colors.R100 : colors.R75};
  transition: background-color 0.2s ease;
  height: 85px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;

  &:hover {
    background-color: ${colors.R100};
  }
`;

export { Header };
