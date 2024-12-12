import Menu from "./Components/Menu";
import MenuMongo from "./Components/MenuMongo";

function App() {
  return (
    <>
    {/* local storage use */}
    <Menu/>
    {/* // mongosDB use  */}
    <MenuMongo/>
    </>
  );
}

export default App;
