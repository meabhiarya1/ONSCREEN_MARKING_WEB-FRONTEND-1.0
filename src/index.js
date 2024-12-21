import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "./store/store";
import App from "./App";

// Import Syncfusion theme styles (Choose ONE theme)
import "@syncfusion/ej2-base/styles/bootstrap5.css";
import "@syncfusion/ej2-icons/styles/bootstrap5.css";
import "@syncfusion/ej2-inputs/styles/bootstrap5.css";
import "@syncfusion/ej2-popups/styles/bootstrap5.css";
import "@syncfusion/ej2-buttons/styles/bootstrap5.css";
import "@syncfusion/ej2-splitbuttons/styles/bootstrap5.css";
import "@syncfusion/ej2-navigations/styles/bootstrap5.css";
import "@syncfusion/ej2-layouts/styles/bootstrap5.css";
import "@syncfusion/ej2-grids/styles/bootstrap5.css";
import "@syncfusion/ej2-react-filemanager/styles/bootstrap5.css";

// Register Syncfusion License
import { registerLicense } from "@syncfusion/ej2-base";
registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NCaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXhdcHRVQmVeV0F3Wks="
);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <App />
    </BrowserRouter>
  </Provider>
);
