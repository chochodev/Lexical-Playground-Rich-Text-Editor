import Editor from './sections';
import { HeroUIProvider } from '@heroui/react';
import { useAlertStore } from '@/store';
import Alert from '@/components/alert';

function App() {
  const { alert } = useAlertStore();
  return (
    <HeroUIProvider>
      {alert.isOpen && <Alert />}
      <Editor />
    </HeroUIProvider>
  );
}

export default App;