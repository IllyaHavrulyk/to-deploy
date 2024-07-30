import { colors } from '@atlaskit/theme';

import { Icon } from '../icon/icon';
import { Button } from './styled/button';

type Props = {
  onClick: () => void;
};

const CopyButton = ({ onClick }: Props) => {
  return (
    <Button className="copy-btn" onClick={onClick} color={colors.N30}>
      <Icon iconName="copy" />
    </Button>
  );
};

export { CopyButton };
