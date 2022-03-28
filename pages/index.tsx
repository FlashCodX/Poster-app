import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../components/Header'
import { sanityClient, urlFor } from '../sanity'
import { Post } from '../typings'

interface Props {
  posts: [Post]
}

export default function Home({ posts }: Props) {
  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Poster Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <div className="border-yy flex items-center justify-between border-black bg-yellow-100 py-10 lg:py-0">
        <div className=" space-y-5 p-10">
          <h1 className="max-w-xl font-serif text-6xl">
            <span className="underline decoration-black decoration-4">
              Poster
            </span>{' '}
            is a place to read, write and connect
          </h1>
          <h2>
            It's easy and free to post your thinking on any topic and connect
            with millions of renders.
          </h2>
        </div>

        <div className="mr-10 hidden md:inline-flex lg:h-full">
          <Image src={require('../public/logo.png')} alt="" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="group cursor-pointer overflow-hidden rounded-lg border">
              <img
                className="transtions-transform h-60 w-full object-cover duration-200 ease-in-out group-hover:scale-105"
                src={urlFor(post.mainImage.asset).url()!}
                alt=""
              />
              <div className="flex justify-between  bg-white p-5">
                <div>
                  <p className="text-lg font-bold">{post.title}</p>
                  <p className="text-xs">
                    {post.description} by {post.author.name}
                  </p>
                </div>
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={urlFor(post.author.image).url()!}
                  alt=""
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

/*Query to get all the data of the type post and select their respective fields (id, tile, name, etc...)*/
export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
  _id,
  title,
  body,
  author -> {
  name,
  image
},
description,
mainImage,
slug
}`

  const posts = await sanityClient.fetch(query)
  return {
    props: {
      posts,
    },
  }
}
