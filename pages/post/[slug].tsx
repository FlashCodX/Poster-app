import { sanityClient, urlFor } from '../../sanity'
import Header from '../../components/Header'
import React, { useState } from 'react'
import { Post } from '../../typings'
import { GetStaticProps } from 'next'
import PortableText from 'react-portable-text'
import { useForm, SubmitHandler } from 'react-hook-form'

interface IFormInput {
  _id: string
  name: string
  email: string
  comment: string
}

interface Props {
  post: Post
}

function Post({ post }: Props) {
  const [submited, setSubmited] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>()

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await fetch('/api/createComment/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        setSubmited(true)
      })
      .catch((err) => {
        setSubmited(false)
      })
  }

  return (
    <main className="text-white">
      <Header />
      <img
        className="h-40 w-full object-cover"
        src={urlFor(post.mainImage).url()!}
        alt=""
      />
      <article className="mx-auto max-w-3xl p-5 text-white">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="mb-5 text-xl  font-light text-gray-400">
          {post.description}
        </h2>
        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={urlFor(post.author.image).url()!}
            alt=""
          />
          <p className="text-sm font-extralight ">
            <span className="text-green-600">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        <div className="mt-10 ">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold " {...props} />
              ),
              h2: (props: any) => (
                <h1 className=" my-10 text-2xl font-bold" {...props} />
              ),

              li: ({ children }: any) => (
                <li className="my-10 mt-10 list-disc">{children}</li>
              ),

              link: ({ href, children }: any) => (
                <a href={href} className=" text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>

        <hr className="max-w-l my-5 mx-auto border border-yellow-500" />
      </article>

      {submited ? (
        <div className="bg-yello-500 my-10 mx-auto flex max-w-2xl flex-col p-10 text-white ">
          <h3 className="text-3xl font-bold">
            Thank you for submitting your comment!
          </h3>
          <p>Once it has been approved, it will appear bellow!</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="my-10 mx-auto mb-10 flex max-w-2xl flex-col p-5"
        >
          <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a Comment Below!</h4>
          <hr className="mt-2 pt-3" />

          <input
            {...register('_id')}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="mb-5 block">
            <span className="text-gray-400">Name</span>
            <input
              {...register('name', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring "
              type="text"
              placeholder="John Smith"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-400">Email</span>
            <input
              {...register('email', { required: true })}
              className="form-input shadowoutline-none mt-1 block w-full rounded border py-2 px-3 ring-yellow-500 focus:ring "
              type="email"
              placeholder="John Smith"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-400">Comment</span>
            <textarea
              {...register('comment', { required: true })}
              className="form-text-area mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring "
              rows={8}
              placeholder="John Smith"
            />
          </label>

          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">The Name field is required</span>
            )}

            {errors.comment && (
              <span className="text-red-500">
                The Comment field is required
              </span>
            )}

            {errors.email && (
              <span className="text-red-500">The Email field is required</span>
            )}
          </div>

          <input
            className="focus:shadow-outline cursor-pointer rounded bg-yellow-500 py-2 px-4 font-bold text-white shadow hover:bg-yellow-400 focus:outline-none"
            type="submit"
          />
        </form>
      )}

      <div className="my-10 mx-auto flex max-w-2xl flex-col space-y-2 p-10 shadow shadow-yellow-500">
        <h3 className="text-4xl">Comments:</h3>
        <hr className="pb-2" />
        {post.comments.length ? (
          post.comments.map((comment) => (
            <div key={comment._id}>
              <p>
                <span className="text-yellow-500">{comment.name}</span>:{' '}
                {comment.comment}
              </p>
            </div>
          ))
        ) : (
          <p>
            <span className="">There are no comment yet!</span>
            <br />
            <span>Be the first to leave a comment!</span>
          </p>
        )}
      </div>
    </main>
  )
}

export default Post

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
        _id,
        slug,
      }`

  const posts = await sanityClient.fetch(query)
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))
  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author -> {
        name,
        image
      },
      'comments': *[
        _type == "comment" && post._ref == ^._id && approved == true],
      description,
      mainImage,
        slug,
        body,
      }
      `

  const post = await sanityClient.fetch(query, { slug: params?.slug })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  }
}
