import { ArticleListItem, sortArticlesByPublishedDateDesc } from './articles-list';

function makeArticle(slug: string, publishedDate: string): ArticleListItem {
  return {
    slug,
    routerLink: `/articles/${slug}`,
    title: slug,
    summary: slug,
    publishedDate,
    relatedTools: [],
  };
}

describe('sortArticlesByPublishedDateDesc', () => {
  it('sorts articles by publishedDate descending (newest first)', () => {
    const articles = [
      makeArticle('oldest-article', '2024-01-01'),
      makeArticle('newest-article', '2024-06-01'),
      makeArticle('middle-article', '2024-03-01'),
    ];

    const result = sortArticlesByPublishedDateDesc(articles);

    expect(result.map((article) => article.slug)).toEqual([
      'newest-article',
      'middle-article',
      'oldest-article',
    ]);
  });

  it('does not mutate the input array', () => {
    const articles = [
      makeArticle('oldest-article', '2024-01-01'),
      makeArticle('newest-article', '2024-06-01'),
    ];
    const originalOrder = articles.map((article) => article.slug);

    sortArticlesByPublishedDateDesc(articles);

    expect(articles.map((article) => article.slug)).toEqual(originalOrder);
  });

  it('returns an empty array when given an empty array', () => {
    expect(sortArticlesByPublishedDateDesc([])).toEqual([]);
  });
});
