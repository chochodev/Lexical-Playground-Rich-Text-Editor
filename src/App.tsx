import Editor from './create';
import { Editor as ProdEditor } from 'chocho-lexicaleditor';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Editor />} />
        <Route path="/prod" element={<ProdEditor />} />
      </Routes>
    </Router>
)
}

export default App;