import Editor from './sections';
import { HeroUIProvider } from '@heroui/react';
import { ToastProvider } from '@heroui/toast';
import { ToolbarContext } from '@/context/ToolbarContext';
import { SharedHistoryContext } from '@/context/SharedHistoryContext';

function CreateEditor() {
  return (
    <HeroUIProvider>
      <SharedHistoryContext>
        <ToolbarContext>
          <ToastProvider placement={'top-center'} toastOffset={40} />
          <Editor />
        </ToolbarContext>
      </SharedHistoryContext>
    </HeroUIProvider>
  );
}

export default CreateEditor;
