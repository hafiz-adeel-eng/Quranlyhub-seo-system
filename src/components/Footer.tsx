import { getDictionary, getLocale } from "@/lib/i18n/getDictionary";

export default function Footer() {
  const dict = getDictionary(getLocale());
  return (
    <footer className="mt-16 border-t border-brand-100 bg-white py-6 text-center text-sm text-gray-500">
      <p>
        {dict.siteName} — © {new Date().getFullYear()} {dict.footer.rights}
      </p>
    </footer>
  );
}
