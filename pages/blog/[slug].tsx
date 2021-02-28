import groq from 'groq';
import { NextPageContext } from 'next';
import imageUrlBuilder from '@sanity/image-url';
import BlockContent, { BlockContentProps } from '@sanity/block-content-to-react'
import { SanityImageObject } from '@sanity/image-url/lib/types/types';
import client from '../../client';

const urlFor = (source: SanityImageObject) => imageUrlBuilder(client).image(source);

interface Props {
  title: string;
  authorName: string;
  categories: [string];
  authorImage: SanityImageObject;
  body: BlockContentProps
}

const Post = ({ title, authorName, categories, authorImage, body }: Props) => (
  <article>
    <h1>{title}</h1>
    <span>By {authorName}</span>
    {categories.length > 0 && (
      <ul>
        Associated with:
        {categories.map((categorie) => (
          <li key={categorie}>{categorie}</li>
        ))}
      </ul>
    )}
    {authorImage && (
      <img
        src={urlFor(authorImage).width(50).url()!}
        alt="Author profile"
      />
    )}
    <BlockContent
      blocks={body}
      imageOptions={{ w: 320, h: 240, fit: 'max' }}
      {...client.config()}
    />
  </article>
);

const getPostQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  title,
  "authorName": author->name, 
  "categories": categories[]->title,
  "authorImage": author->image,
  body
  }`;

Post.getInitialProps = async ({ query }: NextPageContext) => {
  const { slug = '' } = query;
  return await client.fetch(getPostQuery, { slug });
};
export default Post;
