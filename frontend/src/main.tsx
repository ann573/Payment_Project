import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { store } from "./../store/store";
import LoadingComponent from "./LoadingComponent";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import Spiner from "./components/Spiner";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <GoogleOAuthProvider clientId="807717909647-3pndosu51h7d93s3pto880ell09ip5md.apps.googleusercontent.com">
    <BrowserRouter>
      <Provider store={store}>
        <Suspense fallback={<Spiner />}>
          <LoadingComponent />
        </Suspense>
      </Provider>
    </BrowserRouter>
  </GoogleOAuthProvider>
  // </StrictMode>
);
