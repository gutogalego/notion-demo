
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";
import { Header } from "../components/header";
import { DocumentList } from "../components/document-list";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Documents
          </h1>
          <p className="text-gray-600">
            Manage and organize your documents with ease
          </p>
        </div>
        <DocumentList />
      </main>
    </div>
  );
}
