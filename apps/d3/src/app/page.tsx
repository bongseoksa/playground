import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>홈</h1>
      <Link href="/LinePlot">LinePlot으로 이동</Link>
    </div>
  );
}
