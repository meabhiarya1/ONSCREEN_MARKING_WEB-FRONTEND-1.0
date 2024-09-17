import Footer from "components/footer/FooterAuthDefault";
import { Routes, Route, Navigate } from "react-router-dom";
import routes from "routes.js";

export default function Auth() {
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <div className="relative float-right h-full min-h-screen w-full bg-white dark:bg-navy-900 ">
      <main className="mx-auto min-h-screen">
        <div className="relative flex h-full items-center justify-center">
          <div className="flex w-full flex-col items-center justify-center bg-[#0b3f7f]">
            <Routes>
              {getRoutes(routes)}
              <Route
                path="/"
                element={<Navigate to="/auth/sign-in" replace />}
              />
            </Routes>
            {/* <Footer /> */}
          </div>
        </div>
      </main>
    </div>
  );
}
