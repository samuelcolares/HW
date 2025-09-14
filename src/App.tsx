import "./index.css";
import { Leads } from "./components/leads";
import { LeadsProvider } from "./providers/leads.provider";
import { OpportunitiesProvider } from "./providers/opportunities.provider";

function App() {
  return (
    <LeadsProvider>
      <OpportunitiesProvider>
        <Leads />
      </OpportunitiesProvider>
    </LeadsProvider>
  );
}

export default App;
