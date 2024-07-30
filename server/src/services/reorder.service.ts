import { LogType } from '../common/enums/log-type.enum';
import { Card } from '../data/models/card';
import { List } from '../data/models/list';
import { loggerService } from './logger.service';

type ReorderCardsProps = {
  lists: List[];
  sourceIndex: number;
  destinationIndex: number;
  sourceListId: string;
  destinationListId: string;
};

class ReorderService {
  public reorder<T>(items: T[], startIndex: number, endIndex: number): T[] {
    const card = items[startIndex];
    const listWithRemoved = this.remove(items, startIndex);
    const result = this.insert(listWithRemoved, endIndex, card);

    return result;
  }

  public reorderCards({
    lists,
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId
  }: ReorderCardsProps): List[] {
    const target: Card = lists.find((list) => list.id === sourceListId)?.cards?.[sourceIndex];

    if (!target) {
      return lists;
    }

    const newLists = lists.map((list) => {
      if (list.id === sourceListId) {
        list.setCards(this.remove(list.cards, sourceIndex));
      }

      if (list.id === destinationListId) {
        list.setCards(this.insert(list.cards, destinationIndex, target));
      }

      return list;
    });
    return newLists;
  }

  private remove<T>(items: T[], index: number): T[] {
    return [...items.slice(0, index), ...items.slice(index + 1)];
  }

  private insert<T>(items: T[], index: number, value: T): T[] {
    return [...items.slice(0, index), value, ...items.slice(index)];
  }
}

//PATTERN: Proxy
class ReorderServiceWithLogging extends ReorderService {
  public reorder<T>(items: T[], startIndex: number, endIndex: number): T[] {
    loggerService.log(
      LogType.LOG,
      `initiated lists reorder with following arguments: ${items}, startIndex: ${startIndex}, endIndex: ${endIndex}`
    );
    return super.reorder(items, startIndex, endIndex);
  }

  public reorderCards({
    lists,
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId
  }: ReorderCardsProps): List[] {
    loggerService.log(
      LogType.LOG,
      `initiated cards reorder with following arguments: ${lists}, sourceIndex: ${sourceIndex}, endIndex: ${destinationIndex}, sourceListId: ${sourceListId}, destinationListId ${destinationListId}`
    );
    return super.reorderCards({ lists, sourceIndex, destinationIndex, sourceListId, destinationListId });
  }
}

export { ReorderServiceWithLogging };
