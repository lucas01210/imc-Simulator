import HomeScreen from "../components/home/HomeScreen";

export default function HomePage({
  searchParams,
}: {
  searchParams?: { screen?: string; teach?: string };
}) {
  const teach = searchParams?.teach === "1" || searchParams?.teach === "true";

  return (
    <main>
      <HomeScreen showTeaching={teach} />
    </main>
  );
}

