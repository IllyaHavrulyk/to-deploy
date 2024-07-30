import type { DraggableLocation, DroppableProvided, DropResult } from '@hello-pangea/dnd';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import React, { useContext, useEffect } from 'react';

import { CardEvent, ListEvent } from '../common/enums/enums';
import { type List } from '../common/types/types';
import { Column } from '../components/column/column';
import { ColumnCreator } from '../components/column-creator/column-creator';
import { SocketContext } from '../context/socket';
import { reorderService } from '../services/reorder.service';
import { Container } from './styled/container';
import { useLists } from '../context/lists';

export const Workspace = () => {
  const { lists, setLists, takeSnapshot } = useLists();

  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.emit(ListEvent.GET, (lists: List[]) => {
      takeSnapshot(lists);
      setLists(lists);
    });
    socket.on(ListEvent.UPDATE, (lists: List[]) => {
      setLists(lists);
    });

    return () => {
      socket.removeAllListeners(ListEvent.UPDATE).close();
    };
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const source: DraggableLocation = result.source;
    const destination: DraggableLocation = result.destination;

    const isNotMoved = source.droppableId === destination.droppableId && source.index === destination?.index;

    if (isNotMoved) {
      return;
    }

    const isReorderLists = result.type === 'COLUMN';

    if (isReorderLists) {
      setLists(reorderService.reorderLists(lists, source.index, destination.index));
      socket.emit(ListEvent.REORDER, source.index, destination.index, (lists: List[]) => {
        takeSnapshot(lists);
      });

      return;
    }

    setLists(reorderService.reorderCards(lists, source, destination));
    socket.emit(
      CardEvent.REORDER,
      {
        sourceListId: source.droppableId,
        destinationListId: destination.droppableId,
        sourceIndex: source.index,
        destinationIndex: destination.index
      },
      (lists: List[]) => {
        takeSnapshot(lists);
      }
    );
  };

  const onCreateList = (name: string) => {
    socket.emit(ListEvent.CREATE, name, (lists: List[]) => {
      takeSnapshot(lists);
    });
  };

  return (
    <React.Fragment>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided: DroppableProvided) => (
            <Container className="workspace-container" ref={provided.innerRef} {...provided.droppableProps}>
              {lists.map((list: List, index: number) => (
                <Column key={list.id} index={index} listName={list.name} cards={list.cards} listId={list.id} />
              ))}
              {provided.placeholder}
              <ColumnCreator onCreateList={onCreateList} />
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    </React.Fragment>
  );
};
