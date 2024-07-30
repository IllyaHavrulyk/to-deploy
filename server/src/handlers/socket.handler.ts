import { Server, Socket } from 'socket.io';

import { ListEvent } from '../common/enums/enums';
import { Database } from '../data/database';
import { ReorderServiceWithLogging } from '../services/reorder.service';

abstract class SocketHandler {
  protected db: Database;

  protected reorderService: ReorderServiceWithLogging;

  protected io: Server;

  public constructor(io: Server, db: Database, reorderService: ReorderServiceWithLogging) {
    this.io = io;
    this.db = db;
    this.reorderService = reorderService;
  }

  public abstract handleConnection(socket: Socket): void;

  protected updateLists(): void {
    this.io.emit(ListEvent.UPDATE, this.db.getData());
  }
}

export { SocketHandler };
