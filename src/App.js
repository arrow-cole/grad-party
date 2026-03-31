import './App.css';
import Footer from './components/Footer';
import Home from './components/Home';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="h-screen bg-white  dark:bg-gray-900">
     <Navbar />
     <Home />
     <Footer />
    </div>
  );
}

export default App;
