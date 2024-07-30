import { randomUUID } from 'crypto';
import { LogType as LogEnum } from '../common/enums/enums';
import { ValueOf } from '../common/types/types';
import { appendFile } from 'fs';
import { join } from 'path';
import { getCurrentDate } from '../helpers/getCurrentDate';

type LogType = ValueOf<typeof LogEnum>;

// PATTERN: Observer
class LoggerService {
  private subscribers: Map<LogType, Subscriber[]>;

  constructor() {
    this.subscribers = new Map();
  }

  public subscribe(type: LogType, subscriber: Subscriber) {
    const selectedSubscribers = this.subscribers.get(type) || [];
    selectedSubscribers.push(subscriber);
    this.subscribers.set(type, selectedSubscribers);
  }

  public unsubscribe(type: LogType, subscriber: Subscriber) {
    const selectedSubscribers = this.subscribers.get(type);

    if (!selectedSubscribers || selectedSubscribers.length === 0) {
      throw Error(`NO SUBSCRIBERS OF TYPE "${type}" WERE FOUND`);
    }

    const newSelectedSubscribers = selectedSubscribers.filter(
      (selectedSubscriber) => selectedSubscriber.id !== subscriber.id
    );

    if (newSelectedSubscribers.length > 0) {
      this.subscribers.set(type, newSelectedSubscribers);
    } else {
      this.subscribers.delete(type);
    }
  }

  public log(type: LogType, data: string) {
    const selectedSubscribers = this.subscribers.get(type);
    selectedSubscribers.forEach((subscriber) => subscriber.update(data));
  }
}

abstract class Subscriber {
  public id = randomUUID();
  public abstract update(data: string): void;
}

class DataLogger extends Subscriber {
  public update(data: string) {
    const contentToAppend = `${getCurrentDate()}: ${data}\n`;

    appendFile(join(__dirname, '../logs/logs.txt'), contentToAppend, (err) => {
      if (err) throw err;
    });
  }
}

class ErrorLogger extends Subscriber {
  public update(data: string) {
    console.error(data);
  }
}

const loggerService = new LoggerService();

const dataLogger = new DataLogger();
const errorLogger = new ErrorLogger();

loggerService.subscribe(LogEnum.LOG, dataLogger);
loggerService.subscribe(LogEnum.ERROR, errorLogger);

export { loggerService };
