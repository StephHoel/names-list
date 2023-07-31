import { Route, Routes } from 'react-router-dom'
import Home from './Home'

export default function App() {
  return (
    <Routes>
      <Route path="/" index element={<Home />} />

      <Route path="names-list/" element={<Home />} />
    </Routes>
  )
}
