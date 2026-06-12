import { MatchProvider } from "@/context/MatchContext";
import { MatchScreen } from "@/components/MatchScreen";

export default function Home() {
  return (
    <MatchProvider>
      <MatchScreen />
    </MatchProvider>
  );
}
