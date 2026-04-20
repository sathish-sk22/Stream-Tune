import { Toaster } from "react-hot-toast";
import Display from "./component/Display";
import AuthWrapper from "./component/AuthWrapper";
import Sidebar from "./component/Sidebar";
import Player from "./component/Player";

const App = () => {
  return (
    <>
      <Toaster />
      <AuthWrapper>
         <div className="h-screen bg-black">
          <div className="h-[90%] flex">
            <Sidebar/>
            <Display/>
          </div>
            <Player/>
         </div>
      </AuthWrapper>
    </>
  
  )
}
export default App;
