'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';
import type { NewsPageConfig } from '@/types/page';
import { useLocaleStore } from '@/lib/stores/localeStore';

interface NewsListProps {
  config: NewsPageConfig;
  embedded?: boolean;
}

function formatNewsDate(date: string, locale: string): string {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(parsed);
}

export default function NewsList({ config, embedded = false }: NewsListProps) {
  const locale = useLocaleStore((state) => state.locale);
  const readMore = locale === 'zh' ? '查看详情' : 'Read more';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
    >
      <div className={embedded ? 'mb-5' : 'mb-8'}>
        <h1 className={`${embedded ? 'text-2xl' : 'text-4xl'} font-serif font-bold text-primary mb-4`}>
          {config.title}
        </h1>
        {config.description && (
          <p className={`${embedded ? 'text-base' : 'text-lg'} text-neutral-600 dark:text-neutral-500 max-w-2xl leading-relaxed`}>
            {config.description}
          </p>
        )}
      </div>

      <div className={embedded ? 'space-y-4' : 'space-y-6'}>
        {config.items.map((item, index) => (
          <motion.article
            key={item.slug}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <Link
              href={`/news/${item.slug}/`}
              className="group block overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex flex-col md:flex-row">
                {item.cover && (
                  <div className="relative aspect-[16/9] w-full flex-none overflow-hidden bg-neutral-100 md:aspect-[4/3] md:w-56 dark:bg-neutral-800">
                    <Image
                      src={item.cover}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.025]"
                      sizes="(max-width: 768px) 100vw, 224px"
                    />
                  </div>
                )}

                <div className={`${embedded ? 'p-4' : 'p-5 sm:p-6'} flex min-w-0 flex-1 flex-col`}>
                  <div className="mb-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" aria-hidden="true" />
                      {formatNewsDate(item.date, locale)}
                    </span>
                    {item.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" aria-hidden="true" />
                        {item.location}
                      </span>
                    )}
                  </div>

                  <h2 className={`${embedded ? 'text-lg' : 'text-xl'} mb-2 font-semibold leading-snug text-primary transition-colors group-hover:text-accent`}>
                    {item.title}
                  </h2>
                  <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
                    {item.summary}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 self-start text-sm font-semibold text-accent">
                    {readMore}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}
