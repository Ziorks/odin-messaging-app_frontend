import { Outlet } from "react-router-dom";
import SiteNavigation from "./components/SiteNavigation";
import { GlobalContext } from "./contexts";
import { useFetchFromAPI } from "./hooks";

function App() {
  const { data, refetch: refetchUser } = useFetchFromAPI("/user/me");
  const user = data?.user;

  return (
    <GlobalContext.Provider value={{ user, refetchUser }}>
      {user && (
        <>
          <SiteNavigation />
          <Outlet />
        </>
      )}
    </GlobalContext.Provider>
  );
}

export default App;
