import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Product } from '~/types';
import { APP_SHOP } from '~/utils/config';
import { cleanSlug, trimSlash, SHOP_BASE, PRODUCT_PERMALINK_PATTERN, CATEGORY_BASE, TAG_BASE } from './permalinks';

const generatePermalink = async ({
  id,
  slug,
  publishDate,
  category,
}: {
  id: string;
  slug: string;
  publishDate: Date;
  category: string | undefined;
}) => {
  const year = String(publishDate.getFullYear()).padStart(4, '0');
  const month = String(publishDate.getMonth() + 1).padStart(2, '0');
  const day = String(publishDate.getDate()).padStart(2, '0');
  const hour = String(publishDate.getHours()).padStart(2, '0');
  const minute = String(publishDate.getMinutes()).padStart(2, '0');
  const second = String(publishDate.getSeconds()).padStart(2, '0');

  const permalink = PRODUCT_PERMALINK_PATTERN.replace('%slug%', slug)
    .replace('%id%', id)
    .replace('%category%', category || '')
    .replace('%year%', year)
    .replace('%month%', month)
    .replace('%day%', day)
    .replace('%hour%', hour)
    .replace('%minute%', minute)
    .replace('%second%', second);

  return permalink
    .split('/')
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');
};

const getNormalizedProduct = async (product: CollectionEntry<'product'>): Promise<Product> => {
  const { id, slug: rawSlug = '', data } = product;
  const { Content, remarkPluginFrontmatter } = await product.render();

  const {
    publishDate: rawPublishDate = new Date(),
    updateDate: rawUpdateDate,
    title,
    excerpt,
    image,
    tags: rawTags = [],
    category: rawCategory,
    draft = false,
    metadata = {},
  } = data;

  const slug = cleanSlug(rawSlug); // cleanSlug(rawSlug.split('/').pop());
  const publishDate = new Date(rawPublishDate);
  const updateDate = rawUpdateDate ? new Date(rawUpdateDate) : undefined;
  const category = rawCategory ? cleanSlug(rawCategory) : undefined;
  const tags = rawTags.map((tag: string) => cleanSlug(tag));

  return {
    id: id,
    slug: slug,
    permalink: await generatePermalink({ id, slug, publishDate, category }),

    publishDate: publishDate,
    updateDate: updateDate,

    title: title,
    excerpt: excerpt,
    image: image,

    category: category,
    tags: tags,

    draft: draft,

    metadata,

    Content: Content,
    // or 'content' in case you consume from API

    readingTime: remarkPluginFrontmatter?.readingTime,
  };
};

const load = async function (): Promise<Array<Product>> {
  const products = await getCollection('product');
  const normalizedProducts = products.map(async (post) => await getNormalizedProduct(post));

  const results = (await Promise.all(normalizedProducts))
    .sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf())
    .filter((post) => !post.draft);

  return results;
};

let _products: Array<Product>;

/** */
export const isShopEnabled = APP_SHOP.isEnabled;
export const isShopListRouteEnabled = APP_SHOP.list.isEnabled;
export const isShopProductRouteEnabled = APP_SHOP.post.isEnabled;
export const isShopCategoryRouteEnabled = APP_SHOP.category.isEnabled;
export const isShopTagRouteEnabled = APP_SHOP.tag.isEnabled;

export const shopListRobots = APP_SHOP.list.robots;
export const shopProductRobots = APP_SHOP.post.robots;
export const shopCategoryRobots = APP_SHOP.category.robots;
export const shopTagRobots = APP_SHOP.tag.robots;

export const shopProductsPerPage = APP_SHOP?.postsPerPage;

/** */
export const fetchProducts = async (): Promise<Array<Product>> => {
  if (!_products) {
    _products = await load();
  }

  return _products;
};

/** */
export const findProductsBySlugs = async (slugs: Array<string>): Promise<Array<Product>> => {
  if (!Array.isArray(slugs)) return [];

  const products = await fetchProducts();

  return slugs.reduce(function (r: Array<Product>, slug: string) {
    products.some(function (post: Product) {
      return slug === post.slug && r.push(post);
    });
    return r;
  }, []);
};

/** */
export const findProductsByIds = async (ids: Array<string>): Promise<Array<Product>> => {
  if (!Array.isArray(ids)) return [];

  const products = await fetchProducts();

  return ids.reduce(function (r: Array<Product>, id: string) {
    products.some(function (post: Product) {
      return id === post.id && r.push(post);
    });
    return r;
  }, []);
};

/** */
export const findLatestProducts = async ({ count }: { count?: number }): Promise<Array<Product>> => {
  const _count = count || 4;
  const products = await fetchProducts();

  return products ? products.slice(0, _count) : [];
};

/** */
export const getStaticPathsShopList = async ({ paginate }) => {
  if (!isShopEnabled || !isShopListRouteEnabled) return [];
  return paginate(await fetchProducts(), {
    params: { shop: SHOP_BASE || undefined },
    pageSize: shopProductsPerPage,
  });
};

/** */
export const getStaticPathsShopProduct = async () => {
  if (!isShopEnabled || !isShopProductRouteEnabled) return [];
  return (await fetchProducts()).flatMap((post) => ({
    params: {
      shop: post.permalink,
    },
    props: { post },
  }));
};

/** */
export const getStaticPathsShopCategory = async ({ paginate }) => {
  if (!isShopEnabled || !isShopCategoryRouteEnabled) return [];

  const products = await fetchProducts();
  const categories = new Set();
  products.map((post) => {
    typeof post.category === 'string' && categories.add(post.category.toLowerCase());
  });

  return Array.from(categories).flatMap((category: string) =>
    paginate(
      products.filter((post) => typeof post.category === 'string' && category === post.category.toLowerCase()),
      {
        params: { category: category, shop: CATEGORY_BASE || undefined },
        pageSize: shopProductsPerPage,
        props: { category },
      }
    )
  );
};

/** */
export const getStaticPathsShopTag = async ({ paginate }) => {
  if (!isShopEnabled || !isShopTagRouteEnabled) return [];

  const products = await fetchProducts();
  const tags = new Set();
  products.map((post) => {
    Array.isArray(post.tags) && post.tags.map((tag) => tags.add(tag.toLowerCase()));
  });

  return Array.from(tags).flatMap((tag: string) =>
    paginate(
      products.filter((post) => Array.isArray(post.tags) && post.tags.find((elem) => elem.toLowerCase() === tag)),
      {
        params: { tag: tag, shop: TAG_BASE || undefined },
        pageSize: shopProductsPerPage,
        props: { tag },
      }
    )
  );
};
