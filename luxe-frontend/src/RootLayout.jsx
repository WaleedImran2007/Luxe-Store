import { Outlet } from "react-router-dom";
import AIAssistant from "./components/AIAssistant.jsx";

const RootLayout = () => {
    return <>
        <AIAssistant />
        <Outlet />
    </>
}

export default RootLayout;