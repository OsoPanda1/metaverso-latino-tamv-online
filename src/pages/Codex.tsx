import { Navigation } from "@/components/Navigation";
import { CodexPanel } from "@/components/codex/CodexPanel";
import { TamvXRBackground } from "@/components/quantum/TamvXRBackground";

const Codex = () => {
  return (
    <TamvXRBackground effect="holohex">
      <Navigation />
      <div className="pt-24 pb-12 px-4">
        <CodexPanel />
      </div>
    </TamvXRBackground>
  );
};

export default Codex;
