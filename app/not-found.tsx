import { LinkButton } from "@/components/Button";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">404</p>
      <h1 className="mt-2 text-2xl font-bold">Sahifa topilmadi</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">Bunday fan yoki sahifa mavjud emas.</p>
      <LinkButton href="/" className="mt-6">
        Fanlarga qaytish
      </LinkButton>
    </main>
  );
}
