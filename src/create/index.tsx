import Editor from './sections';
import { HeroUIProvider } from '@heroui/react';
import { ToastProvider } from '@heroui/toast';

function CreateEditor() {
  return (
    <HeroUIProvider>
      <ToastProvider placement={"top-center"} toastOffset={40}  />
      <Editor />
    </HeroUIProvider>
  );
}

export default CreateEditor;