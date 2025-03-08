import Editor from './sections';
import { HeroUIProvider } from '@heroui/react';
import { ToastProvider } from '@heroui/toast';
import Alert from '@/components/alert';

function CreateEditor() {
  return (
    <HeroUIProvider>
      <ToastProvider placement={"top-center"} toastOffset={40}  />
      <Editor />
    </HeroUIProvider>
  );
}

export default CreateEditor;