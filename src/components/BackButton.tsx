import Link from "next/link";

interface Props {
  href: string;
  label?: string;
}

export default function BackButton({ href, label = "Back" }: Props) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-xl border border-white/10 hover:bg-white/5 w-fit mb-6"
    >
      ← {label}
    </Link>
  );
}
