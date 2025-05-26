import "react-toastify/dist/ReactToastify.css";
import "./assets/styles/app.css";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AppRoutes from "./routes/AppRoutes";

function App() {
    return (
        <>
            <ToastContainer
                style={{ fontSize: "14px" }}
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
            />
            <Router>
                <AppRoutes />
            </Router>
        </>
    );
}

export default App;
