import type { DraggableLocation } from '@hello-pangea/dnd';

import { type Card, type List } from '../common/types/types';

export const reorderService = {
  reorderLists(items: List[], startIndex: number, endIndex: number): List[] {
    const itemToMove = items[startIndex];
    const remainingItems = items.filter((_, index) => index !== startIndex);

    return [...remainingItems.slice(0, endIndex), itemToMove, ...remainingItems.slice(endIndex)];
  },

  reorderCards(lists: List[], source: DraggableLocation, destination: DraggableLocation): List[] {
    const getCardsFromLists = (lists: List[], location: DraggableLocation): Card[] =>
      lists.find((list) => list.id === location.droppableId)?.cards || [];

    const removeCardFromList = (cards: Card[], index: number): Card[] => [
      ...cards.slice(0, index),
      ...cards.slice(index + 1)
    ];

    const addCardToList = (cards: Card[], index: number, card: Card): Card[] => [
      ...cards.slice(0, index),
      card,
      ...cards.slice(index)
    ];

    const current = getCardsFromLists(lists, source);
    const next = getCardsFromLists(lists, destination);
    const target = current[source.index];

    const isMovingInSameList = source.droppableId === destination.droppableId;

    if (isMovingInSameList) {
      const reordered = [...current];
      const [removed] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, removed);

      return lists.map((list) => (list.id === source.droppableId ? { ...list, cards: reordered } : list));
    }

    const updatedLists = lists.map((list) => {
      if (list.id === source.droppableId) {
        return { ...list, cards: removeCardFromList(current, source.index) };
      }
      if (list.id === destination.droppableId) {
        return { ...list, cards: addCardToList(next, destination.index, target) };
      }
      return list;
    });

    return updatedLists;
  }
};
