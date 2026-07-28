import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NewsDetailClient, { type NewsDetailLocaleData } from '@/components/news/NewsDetailClient';
import { getConfig } from '@/lib/config';
import { getMarkdownContent, getPageConfig } from '@/lib/content';
import { getRuntimeI18nConfig } from '@/lib/i18n/config';
import type { NewsPageConfig } from '@/types/page';

function getNewsPost(postSlug: string, locale?: string) {
  const config = getPageConfig<NewsPageConfig>('news', locale);
  return config?.items.find((item) => item.slug === postSlug) || null;
}

export function generateStaticParams() {
  const config = getConfig();
  const runtimeI18n = getRuntimeI18nConfig(config.i18n);
  const targetLocales = runtimeI18n.enabled ? runtimeI18n.locales : [runtimeI18n.defaultLocale];
  const slugs = new Set<string>();

  for (const locale of targetLocales) {
    const newsConfig = getPageConfig<NewsPageConfig>('news', locale);
    newsConfig?.items.forEach((item) => slugs.add(item.slug));
  }

  return Array.from(slugs).map((post) => ({ post }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ post: string }>;
}): Promise<Metadata> {
  const { post: postSlug } = await params;
  const post = getNewsPost(postSlug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ post: string }>;
}) {
  const { post: postSlug } = await params;
  const config = getConfig();
  const runtimeI18n = getRuntimeI18nConfig(config.i18n);
  const targetLocales = runtimeI18n.enabled ? runtimeI18n.locales : [runtimeI18n.defaultLocale];
  const dataByLocale: Record<string, NewsDetailLocaleData> = {};

  for (const locale of targetLocales) {
    const post = getNewsPost(postSlug, locale);
    if (post) {
      dataByLocale[locale] = {
        post,
        content: getMarkdownContent(post.content, locale),
      };
    }
  }

  const defaultPost = getNewsPost(postSlug);
  if (defaultPost && !dataByLocale[runtimeI18n.defaultLocale]) {
    dataByLocale[runtimeI18n.defaultLocale] = {
      post: defaultPost,
      content: getMarkdownContent(defaultPost.content),
    };
  }

  if (Object.keys(dataByLocale).length === 0) {
    notFound();
  }

  return (
    <NewsDetailClient
      dataByLocale={dataByLocale}
      defaultLocale={runtimeI18n.defaultLocale}
    />
  );
}
