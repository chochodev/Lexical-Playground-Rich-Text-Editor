import Editor from './create';
import { HeroUIProvider } from '@heroui/react';
import './index.css';
import { useAlertStore } from '@/store';
import Alert from '@/components/alert';

export function App() {
  const { alert } = useAlertStore();
  return (
    <HeroUIProvider>
      {alert.isOpen && <Alert />}
      <Editor />
    </HeroUIProvider>
  );
}

export default App;