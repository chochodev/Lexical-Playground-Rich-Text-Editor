# chocho-lexicaleditor

A rich text editor built using the **Lexical** library, designed for seamless integration into **React** applications.

## Features

- Lightweight and highly extensible
- Uses the **Lexical** library for fast, accessible, and reliable text editing
- Fully typed with TypeScript support
- Supports custom styling and theming

## Installation

Install the package using npm or yarn:

```sh
npm install chocho-lexicaleditor
# or
yarn add chocho-lexicaleditor
```

## Usage

### Import the Editor Component

```tsx
import React from "react";
import { Editor } from "chocho-lexicaleditor";
import "chocho-lexicaleditor/style";

const App = () => {
    return (
        <div>
            <h1>My Rich Text Editor</h1>
            <Editor />
        </div>
    );
};

export default App;
```

### Styling

To apply the default styles, import the CSS file inside your global stylesheet or component:

```css
@import "chocho-lexicaleditor/style";
```

## API

### `Editor` Props

| Prop | Type | Description |
|------|------|-------------|
| `placeholder` | `string` | Placeholder text inside the editor |
| `onChange` | `(value: string) => void` | Callback triggered when content changes |
| `defaultValue` | `string` | Initial editor content |

Example usage:

```tsx
<Editor placeholder="Start typing..." onChange={(value) => console.log(value)} />
```

## Contributing

Contributions are welcome! Feel free to fork this repository, submit issues, or open pull requests.

## License

This project is licensed under the [MIT License](LICENSE).

