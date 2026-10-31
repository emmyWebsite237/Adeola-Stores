import { AlertCircle, Database } from 'lucide-react';

interface DataMissingProps {
  title?: string;
  message?: string;
  icon?: 'database' | 'alert';
}

/**
 * Reusable UI component shown when Supabase data is unavailable
 * (either because env vars are missing or the table is empty).
 */
export default function DataMissing({
  title = 'Data Not Found',
  message = 'Could not load data. Please ensure Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY) are configured in your Vercel or local .env file.',
  icon = 'database',
}: DataMissingProps) {
  const Icon = icon === 'database' ? Database : AlertCircle;

  return (
    <div className="bg-white rounded-3xl border border-amber-200 p-10 sm:p-14 text-center space-y-4 shadow-sm max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <h3 className="font-extrabold text-base text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-sm mx-auto">
          {message}
        </p>
      </div>
    </div>
  );
}
