import { socket, SocketContext } from './context/socket';
import { Workspace } from './pages/Workspace';
import { ListsProvider } from './context/lists';

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <ListsProvider>
        <Workspace />
      </ListsProvider>
    </SocketContext.Provider>
  );
}

export { App };
