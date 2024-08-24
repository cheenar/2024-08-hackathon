import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button, Container, SpaceBetween } from "@cloudscape-design/components";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Container>
        <SpaceBetween direction="horizontal" size="s">
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </SpaceBetween>
        <h1>Vite + React</h1>
        <div className="card">
          <Button onClick={() => setCount((count) => count + 1)}>
            Count ist {count}
          </Button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </Container>
    </>
  );
}

export default App;
