import type { Socket } from 'socket.io';

import { CardEvent, LogType } from '../common/enums/enums';
import { Card } from '../data/models/card';
import { SocketHandler } from './socket.handler';
import { loggerService } from '../services/logger.service';
import { List } from '../data/models/list';

class CardHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this));
    socket.on(CardEvent.RENAME, this.renameCard.bind(this));
    socket.on(CardEvent.CHANGE_DESCRIPTION, this.changeDescription.bind(this));
    socket.on(CardEvent.COPY, this.copyCard.bind(this));
  }

  public createCard(
    { listId, cardName }: { listId: string; cardName: string },
    callback: (lists: List[]) => void
  ): void {
    try {
      const newCard = new Card(cardName, '');
      const lists = this.db.getData();

      const updatedLists = lists.map((list) => {
        return list.id === listId ? list.setCards(list.cards.concat(newCard)) : list;
      });

      this.db.setData(updatedLists);
      this.updateLists();

      loggerService.log(LogType.LOG, `created card with id ${newCard.id}`);
      callback(this.db.getData());
    } catch (error) {
      loggerService.log(LogType.ERROR, error);
    }
  }

  private deleteCard({ cardId }: { cardId: string }, callback: (lists: List[]) => void): void {
    try {
      const { lists, listIndex } = this.initiateSocketEventHandler(cardId);

      lists[listIndex].cards = lists[listIndex].cards.filter((card) => card.id !== cardId);

      this.db.setData(lists);
      this.updateLists();

      loggerService.log(LogType.LOG, `deleted card with id ${cardId}`);
      callback(this.db.getData());
    } catch (error) {
      loggerService.log(LogType.ERROR, error);
    }
  }

  private renameCard({ cardId, title }, callback: (lists: List[]) => void): void {
    try {
      const { lists, listIndex, cardIndex } = this.initiateSocketEventHandler(cardId);

      lists[listIndex].cards[cardIndex].name = title;

      this.db.setData(lists);
      this.updateLists();

      loggerService.log(LogType.LOG, `renamed card with id ${cardId} to ${title}`);
      callback(this.db.getData());
    } catch (error) {
      loggerService.log(LogType.ERROR, error);
    }
  }

  private changeDescription({ cardId, description }, callback: (lists: List[]) => void): void {
    try {
      const { lists, listIndex, cardIndex } = this.initiateSocketEventHandler(cardId);

      lists[listIndex].cards[cardIndex].description = description;

      this.db.setData(lists);
      this.updateLists();

      loggerService.log(LogType.LOG, `changed description of card with id ${cardId} to ${description}`);
      callback(this.db.getData());
    } catch (error) {
      loggerService.log(LogType.ERROR, error);
    }
  }

  private copyCard({ cardId }: { cardId: string }, callback: (lists: List[]) => void): void {
    try {
      const { lists, listIndex, cardIndex } = this.initiateSocketEventHandler(cardId);

      const newCard = lists[listIndex].cards[cardIndex].clone();

      lists[listIndex].cards.push(newCard);

      this.db.setData(lists);
      this.updateLists();

      loggerService.log(LogType.LOG, `made a copy of card with id ${cardId}, id of new card is ${newCard.id}`);
      callback(this.db.getData());
    } catch (error) {
      loggerService.log(LogType.ERROR, error);
    }
  }

  private initiateSocketEventHandler(cardId: string) {
    const lists = this.db.getData();
    const listIndex = lists.findIndex((list) => list.cards.some((card) => card.id === cardId));

    const cards = lists[listIndex].cards;
    const cardIndex = cards.findIndex((card) => card.id === cardId);

    return { lists, listIndex, cardIndex };
  }

  private reorderCards(
    {
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId
    }: {
      sourceIndex: number;
      destinationIndex: number;
      sourceListId: string;
      destinationListId: string;
    },
    callback: (lists: List[]) => void
  ): void {
    try {
      const lists = this.db.getData();
      const reordered = this.reorderService.reorderCards({
        lists,
        sourceIndex,
        destinationIndex,
        sourceListId,
        destinationListId
      });
      this.db.setData(reordered);
      this.updateLists();
      callback(this.db.getData());
    } catch (error) {
      loggerService.log(LogType.ERROR, error);
    }
  }
}

export { CardHandler };
