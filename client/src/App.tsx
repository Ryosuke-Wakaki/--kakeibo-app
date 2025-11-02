// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./shared/components/Header";
import { Sidebar } from "./shared/components/Sidebar";
import { Home } from "./features/home/Home";
import { Report } from "./features/report/Report";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
