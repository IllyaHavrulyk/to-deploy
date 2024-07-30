import { colors } from '@atlaskit/theme';

import { Icon } from '../icon/icon';
import { Button } from './styled/button';

type Props = {
  onClick: () => void;
  color?: string;
};

const DeleteButton = ({ onClick, color }: Props) => {
  return (
    <Button
      className="delete-btn"
      onClick={onClick}
      color={color ?? colors.N30}
    >
      <Icon iconName="delete" />
    </Button>
  );
};

export { DeleteButton };
