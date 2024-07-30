import type { Socket } from 'socket.io';
import { ListEvent } from '../common/enums/enums';
import { List } from '../data/models/list';
import { SocketHandler } from './socket.handler';
import { loggerService } from '../services/logger.service';
import { LogType } from '../common/enums/enums';

class ListHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(ListEvent.CREATE, this.createList.bind(this));
    socket.on(ListEvent.GET, this.getLists.bind(this));
    socket.on(ListEvent.REORDER, this.reorderLists.bind(this));
    socket.on(ListEvent.DELETE, this.deleteList.bind(this));
    socket.on(ListEvent.RENAME, this.renameList.bind(this));
    socket.on(ListEvent.REVERT, this.revertLists.bind(this));
  }

  private getLists(callback: (lists: List[]) => void): void {
    callback(this.db.getData());
  }

  private reorderLists(sourceIndex: number, destinationIndex: number, callback: (lists: List[]) => void): void {
    const lists = this.db.getData();
    const reorderedLists = this.reorderService.reorder(lists, sourceIndex, destinationIndex);
    this.db.setData(reorderedLists);
    this.updateLists();
    callback(this.db.getData());
  }

  private createList(name: string, callback: (lists: List[]) => void): void {
    try {
      const lists = this.db.getData();
      const newList = new List(name);

      this.db.setData(lists.concat(newList));
      this.updateLists();

      loggerService.log(LogType.LOG, `created new list with id ${newList.id}`);
      callback(this.db.getData());
    } catch (error) {
      loggerService.log(LogType.ERROR, error);
    }
  }

  private deleteList({ listId }: { listId: string }, callback: (lists: List[]) => void): void {
    try {
      const lists = this.db.getData();
      const filteredLists = lists.filter((list) => list.id !== listId);

      this.db.setData(filteredLists);
      this.updateLists();

      loggerService.log(LogType.LOG, `deleted list with id ${listId}\n`);
      callback(this.db.getData());
    } catch (error) {
      loggerService.log(LogType.ERROR, error);
    }
  }

  private renameList({ listId, name }: { listId: string; name: string }, callback: (lists: List[]) => void) {
    try {
      const lists = this.db.getData();
      const targetIndex = lists.findIndex((list) => list.id === listId);

      lists[targetIndex].name = name;

      this.db.setData(lists);
      this.updateLists();

      loggerService.log(LogType.LOG, `changed name of list with id ${listId} to ${name}`);
      callback(this.db.getData());
    } catch (error) {
      loggerService.log(LogType.ERROR, error);
    }
  }

  private revertLists({ lists }: { lists: List[] }, callback: (lists: List[]) => void) {
    try {
      const oldLists = this.db.getData();

      const newLists = lists.map((list, index) => {
        list.id = oldLists[index].id;
        list.setCards = oldLists[index].setCards;
        return list;
      });

      this.db.setData(newLists);
      this.updateLists();

      loggerService.log(LogType.LOG, 'reverted changes');
      callback(this.db.getData());
    } catch (error) {
      loggerService.log(LogType.ERROR, error);
    }
  }
}

export { ListHandler };
