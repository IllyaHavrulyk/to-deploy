import { useState, useContext, createContext, ReactNode, useEffect } from 'react';
import { List } from '../common/types/types';
import { historyManager, originator } from '../services/history.service';
import { socket } from './socket';
import { ListEvent } from '../common/enums/list-event.enum';

const ListsContext = createContext<{
  lists: List[];
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
  takeSnapshot: (lists: List[]) => void;
}>({
  lists: [],
  setLists: () => {},
  takeSnapshot: () => {}
});

export function ListsProvider({ children }: { children: ReactNode }) {
  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    originator.setState(lists);

    const pressedKeys = new Map();

    function onKeyUp(e: KeyboardEvent) {
      if (pressedKeys.has(e.code)) {
        pressedKeys.delete(e.code);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (!pressedKeys.has(e.code)) {
        pressedKeys.set(e.code, e.code);

        if (checkForCombination(['ControlLeft', 'KeyZ'], pressedKeys)) {
          const newState = historyManager.moveBack();
          if (newState) {
            socket.emit(ListEvent.REVERT, { lists: newState }, (lists: List[]) => {
              takeSnapshot(lists);
            });
          }
        }

        if (checkForCombination(['ControlLeft', 'KeyY'], pressedKeys)) {
          const newState = historyManager.moveForward();
          if (newState) {
            socket.emit(ListEvent.REVERT, { lists: newState }, (lists: List[]) => {
              takeSnapshot(lists);
            });
          }
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  function checkForCombination(combination: string[], pressedKeys: Map<string, string>) {
    for (let i = 0; i < combination.length; i += 1) {
      if (!pressedKeys.has(combination[i])) {
        return false;
      }
    }
    return true;
  }

  function takeSnapshot(lists: List[]) {
    originator.setState(lists);
    historyManager.backup(originator.save());
  }

  return <ListsContext.Provider value={{ lists, setLists, takeSnapshot }}>{children}</ListsContext.Provider>;
}

export function useLists() {
  return useContext(ListsContext);
}
