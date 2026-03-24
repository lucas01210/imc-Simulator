import HomeScreen from "../components/home/HomeScreen";
import BrandSelectScreen from "../components/home/BrandSelectScreen";

export default function HomePage({
  searchParams,
}: {
  searchParams?: { screen?: string; teach?: string };
}) {
  const screen = searchParams?.screen ?? "home";
  const teach = searchParams?.teach === "1" || searchParams?.teach === "true";

  return (
    <main>
      {screen === "brand" ? (
        <BrandSelectScreen />
      ) : (
        <HomeScreen showTeaching={teach} />
      )}
    </main>
  );
}

