import { colors } from "@atlaskit/theme";
import styled from "@emotion/styled";

import { SPACE_IN_PX } from "../../../common/constants/constants";

const Container = styled.div`
  margin: ${SPACE_IN_PX}px;
  display: flex;
  flex-direction: column;
  background-color: ${colors.N20};
`;

export { Container };
