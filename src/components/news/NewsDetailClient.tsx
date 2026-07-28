'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react';
import type { NewsItemConfig } from '@/types/page';
import { useLocaleStore } from '@/lib/stores/localeStore';

export interface NewsDetailLocaleData {
  post: NewsItemConfig;
  content: string;
}

interface NewsDetailClientProps {
  dataByLocale: Record<string, NewsDetailLocaleData>;
  defaultLocale: string;
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

export default function NewsDetailClient({ dataByLocale, defaultLocale }: NewsDetailClientProps) {
  const locale = useLocaleStore((state) => state.locale);
  const fallback = dataByLocale[defaultLocale] || Object.values(dataByLocale)[0];
  const data = dataByLocale[locale] || fallback;

  if (!data) {
    return null;
  }

  const { post, content } = data;
  const backLabel = locale === 'zh' ? '返回动态' : 'Back to News';
  const galleryLabel = locale === 'zh' ? '照片' : 'Photos';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
    >
      <Link
        href="/news/"
        className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition-colors hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:text-neutral-400"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {backLabel}
      </Link>

      <header className="mb-8">
        <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-neutral-500 dark:text-neutral-400">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {formatNewsDate(post.date, locale)}
          </span>
          {post.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {post.location}
            </span>
          )}
        </div>
        <h1 className="max-w-3xl font-serif text-3xl font-bold leading-tight text-primary sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          {post.summary}
        </p>
      </header>

      {post.cover && (
        <div className="relative mb-9 aspect-[16/9] overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
          <Image
            src={post.cover}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>
      )}

      <div className="prose-news text-neutral-700 dark:text-neutral-300">
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h2 className="mb-4 mt-9 font-serif text-3xl font-bold text-primary">{children}</h2>,
            h2: ({ children }) => <h2 className="mb-4 mt-9 border-b border-neutral-200 pb-2 font-serif text-2xl font-bold text-primary dark:border-neutral-800">{children}</h2>,
            h3: ({ children }) => <h3 className="mb-3 mt-7 text-xl font-semibold text-primary">{children}</h3>,
            p: ({ children }) => <p className="mb-5 leading-7">{children}</p>,
            ul: ({ children }) => <ul className="mb-5 ml-5 list-disc space-y-2">{children}</ul>,
            ol: ({ children }) => <ol className="mb-5 ml-5 list-decimal space-y-2">{children}</ol>,
            li: ({ children }) => <li className="pl-1">{children}</li>,
            a: ({ ...props }) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
              />
            ),
            blockquote: ({ children }) => (
              <blockquote className="my-6 border-l-4 border-accent/60 pl-5 italic text-neutral-600 dark:text-neutral-400">
                {children}
              </blockquote>
            ),
            strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {post.gallery && post.gallery.length > 0 && (
        <section className="mt-10 border-t border-neutral-200 pt-8 dark:border-neutral-800">
          <h2 className="mb-5 font-serif text-2xl font-bold text-primary">{galleryLabel}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {post.gallery.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className={`${post.gallery!.length % 2 === 1 && index === 0 ? 'sm:col-span-2 sm:aspect-[16/9]' : ''} relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800`}
              >
                <Image
                  src={image}
                  alt={`${post.title} - ${galleryLabel} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 448px"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </motion.article>
  );
}
