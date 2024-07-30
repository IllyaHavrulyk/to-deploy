import { Icon } from '../icon/icon';
import { Button } from './styled/button';

type Props = {
  onClick: () => void;
};

const AddButton = ({ onClick }: Props) => {
  return (
    <Button className="add-btn" onClick={onClick} color='transparent'>
      <Icon iconName="add" />
    </Button>
  );
};

export { AddButton };
