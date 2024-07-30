import type { DraggableProvided } from '@hello-pangea/dnd';

import { type Card } from '../../common/types/types';
import { CopyButton } from '../primitives/copy-button';
import { DeleteButton } from '../primitives/delete-button';
import { Splitter } from '../primitives/styled/splitter';
import { Text } from '../primitives/text';
import { Title } from '../primitives/title';
import { Container } from './styled/container';
import { Content } from './styled/content';
import { Footer } from './styled/footer';
import { useContext } from 'react';
import { SocketContext } from '../../context/socket';
import { CardEvent } from '../../common/enums/card-event.enum';
import { useLists } from '../../context/lists';
import { List } from '../../common/types/types';

type Props = {
  card: Card;
  isDragging: boolean;
  provided: DraggableProvided;
};

export const CardItem = ({ card, isDragging, provided }: Props) => {
  const { takeSnapshot } = useLists();
  const socket = useContext(SocketContext);

  const handleDeleteCard = () => {
    socket.emit(CardEvent.DELETE, { cardId: card.id }, (lists: List[]) => {
      takeSnapshot(lists);
    });
  };

  const handleTitleChange = (title: string) => {
    console.log(title);
    socket.emit(CardEvent.RENAME, { cardId: card.id, title }, (lists: List[]) => {
      console.log(`title change fired with title ${title}`);

      takeSnapshot(lists);
    });
  };

  const handleDescriptionChange = (description: string) => {
    socket.emit(CardEvent.CHANGE_DESCRIPTION, { cardId: card.id, description }, (lists: List[]) => {
      takeSnapshot(lists);
    });
  };

  const handleCopyCard = () => {
    socket.emit(CardEvent.COPY, { cardId: card.id }, (lists: List[]) => {
      takeSnapshot(lists);
    });
  };

  return (
    <Container
      className="card-container"
      isDragging={isDragging}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      data-is-dragging={isDragging}
      data-testid={card.id}
      aria-label={card.name}
    >
      <Content>
        <Title onChange={handleTitleChange} title={card.name} fontSize="large" isBold />
        <Text text={card.description} onChange={handleDescriptionChange} />
        <Footer>
          <DeleteButton onClick={handleDeleteCard} />
          <Splitter />
          <CopyButton onClick={handleCopyCard} />
        </Footer>
      </Content>
    </Container>
  );
};
