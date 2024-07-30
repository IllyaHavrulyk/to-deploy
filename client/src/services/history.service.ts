import { List } from '../common/types/list.type';

// PATTERN: Memento
type Memento = {
  getState(): List[];
};

class ConcreteMemento implements Memento {
  private state: List[];

  constructor(state: List[]) {
    this.state = [...state];
  }

  public getState() {
    return this.state;
  }
}

class Originator {
  private state: List[] = [];

  public setState(state: List[]) {
    this.state = state;
  }

  public save() {
    return new ConcreteMemento(this.state);
  }

  public restore(memento: ConcreteMemento) {
    this.state = memento.getState();
  }
}

class HistoryManager {
  private originator: Originator;
  private history: ConcreteMemento[] = [];
  private currentIndex: number = -1;

  constructor(originator: Originator) {
    this.originator = originator;
  }

  public backup(memento: ConcreteMemento) {
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    if (this.history.length === 20) {
      this.history.shift();
      this.currentIndex--;
    }

    this.history.push(memento);
    this.currentIndex++;
  }

  public moveBack(): List[] | null {
    if (this.currentIndex >= 0) {
      const memento = this.history[this.currentIndex];
      this.originator.restore(memento);
      this.currentIndex -= 1;
      return memento.getState();
    } else {
      return null;
    }
  }

  public moveForward(): List[] | null {
    const newIndex = this.currentIndex + 1;
    if (newIndex < this.history.length) {
      const memento = this.history[newIndex];
      this.originator.restore(memento);
      this.currentIndex = newIndex;
      return memento.getState();
    } else {
      return null;
    }
  }
}

const originator = new Originator();
const historyManager = new HistoryManager(originator);

export { originator, historyManager, HistoryManager, Originator, ConcreteMemento };
