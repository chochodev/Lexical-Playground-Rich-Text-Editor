import Editor from './create';
import {HeroUIProvider} from "@heroui/react";

function App() {
  return (
    <HeroUIProvider>
      <Editor />
    </HeroUIProvider>
  );
}

export default App;
