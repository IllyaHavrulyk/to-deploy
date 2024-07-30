import { DroppableProvided } from '@hello-pangea/dnd';

import { type Card } from '../../../common/types/types';
import { DropZone } from '../styled/drop-zone';
import { Cards } from './cards';

type Props = {
  dropProvided: DroppableProvided;
  cards: Card[];
};

const List = ({ cards, dropProvided }: Props) => {
  return (
    <div className="list-container">
      <DropZone ref={dropProvided.innerRef}>
        <Cards cards={cards} />
        {dropProvided.placeholder}
      </DropZone>
    </div>
  );
};

export { List };
