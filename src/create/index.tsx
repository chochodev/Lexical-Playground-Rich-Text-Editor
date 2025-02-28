import Editor from './sections';
import { HeroUIProvider } from '@heroui/react';
import { useAlertStore } from '@/store';
import Alert from '@/components/alert';

function CreateEditor() {
  const { alert } = useAlertStore();
  return (
    <HeroUIProvider>
      {alert.isOpen && <Alert />}
      <Editor />
    </HeroUIProvider>
  );
}

export default CreateEditor;