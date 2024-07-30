import type { DroppableProvided } from "@hello-pangea/dnd";
import { Droppable } from "@hello-pangea/dnd";

import { type Card } from "../../common/types/types";
import { List } from "./components/list";
import { ListWrapper } from "./styled/list-wrapper";
import { ScrollContainer } from "./styled/scroll-container";

type Props = {
  listId: string;
  listType: string;
  cards: Card[];
};

const CardsList = ({ listId, listType, cards }: Props) => {
  return (
    <Droppable droppableId={listId} type={listType}>
      {(dropProvided: DroppableProvided) => (
        <ListWrapper {...dropProvided.droppableProps}>
          <ScrollContainer>
            <List cards={cards} dropProvided={dropProvided} />
          </ScrollContainer>
        </ListWrapper>
      )}
    </Droppable>
  );
};

export { CardsList };
