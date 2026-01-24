import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background p-8 text-center text-foreground">
      <div className="rounded-full bg-muted p-6">
        <FileQuestion size={48} className="text-muted-foreground" />
      </div>
      <h2 className="text-3xl font-bold tracking-tight">الصفحة غير موجودة</h2>
      <p className="text-muted-foreground">عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.</p>
      <Link
        href="/"
        className="mt-4 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        العودة للرئيسية
      </Link>
    </div>
  )
}
