import { getPermalink, getBlogPermalink, getAsset, getHomePermalink, getShopPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: getPermalink('')
    },
    {
      text: 'Services',
      links: [
        {
          text: 'Website Development',
          href: getPermalink('/services'),
        },
        {
          text: 'Application Development',
          href: getPermalink('/services'),
        },
        {
          text: 'Digital Marketing',
          href: getPermalink('/services'),
        },
        {
          text: 'Business Consultation',
          href: getPermalink('/services'),
        }
      ],
    },
    {
      text: 'About',
      links: [
        {
          text: 'About Us',
          href: getPermalink('/about'),
        },
        {
          text: 'Case Studies',
          href: getPermalink('/case-studies'),
        }
      ],
    },
    {
      text: 'Blog',
      href: getBlogPermalink()
    },
    {
      text: 'Shop',
      href: getShopPermalink()
    }
  ],
  actions: [{ text: 'Contact Now', href: getPermalink('/contact') }],
};

export const footerData = {
  links: [
    {
      title: 'Company',
      links: [
        { text: 'Home', href: '/' },
        { text: 'Services', href: getPermalink('/services') },
        { text: 'Case Studies', href: getPermalink('/case-studies') },
        { text: 'About Us', href: getPermalink('/about') },
        { text: 'Contact Us', href: getPermalink('/contact') },
      ],
    },
    {
      title: 'Services',
      links: [
        { text: 'Website Development', href: getPermalink('/services') },
        { text: 'Application Development', href: getPermalink('/services') },
        { text: 'Digital Marketing', href: getPermalink('/services') },
        { text: 'Business Consultation', href: getPermalink('/services') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/onwidget/astrowind' },
  ],
  footNote: `
    Copyrights @ 2023 <a class="text-accent hover:underline dark:text-accent" href=${getHomePermalink('/')}> OwlthTech</a> · All rights reserved.
  `,
};
