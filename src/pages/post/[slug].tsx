import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client'
import commonStyles from '../../styles/common.module.scss';
import {FiCalendar,FiUser,FiClock} from 'react-icons/fi'
import styles from './post.module.scss';
import {format} from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

 export default function Post({post}:PostProps) {

  const contentWordsAmount = post.data.content.reduce((total, item) => {
    const headingWordsAmount = item.heading.split(/\s+/).length;

    const bodyWordsAmountArray = item.body.map(t => t.text.split(/\s+/).length);
    const bodyWordsAmount = bodyWordsAmountArray.reduce(
      (acc, curr) => acc + curr
    );
    return total + headingWordsAmount + bodyWordsAmount;
  }, 0);

  const wordsReadAvg = 200;
  const readingTime = Math.ceil(contentWordsAmount / wordsReadAvg);
  return(
    <main className={styles.container}>
      <div className={styles.image}>
         <img  src={post.data.banner.url} alt="Banner" />
       </div>
        <article className={styles.content}>
         
           <div className={styles.head}>
            <h1>{post.data.title}</h1>
             <div className={styles.bottom}>
                  <p><FiCalendar/>  {post.first_publication_date}</p>
                  <p><FiUser/>  {post.data.author}</p>
                  <p><FiClock/> {readingTime} min</p>
             </div>
           </div>
            <>
               {post.data.content.map((content,i)=>(
                    <div className={styles.text}>
              
                    <h2>{String(content.heading)}</h2>
                     <div dangerouslySetInnerHTML={{__html:String(content.body[0].text)}}></div>
                    </div>
               ))}
            </>  
        </article>
    </main>

  )

 }

   export const getStaticPaths:GetStaticPaths = async () => {
     const prismic = getPrismicClient();
   const posts = await prismic.query(
      Prismic.predicates.at('document.type','posts'),
       {fetch:['posts.banner','posts.author','posts.title','posts.heading']
         
      },
     
     );

     const paths = posts.results.map(post=>{

      return{
          params:{
              slug:post.uid
          }
      }
   })
 
    return{
      paths,
      fallback: 'blocking'
  }

   }

  export const getStaticProps:GetStaticProps = async context => {
    const prismic = getPrismicClient();
    const {slug} = context.params
    const response = await prismic.getByUID(`posts`,String(slug),{});
    
   console.log(JSON.stringify(response,null,2))
    const post ={
      first_publication_date:format(
        new Date(response.first_publication_date),
        'd MMM y',
        {
          locale: ptBR,
        }
      ),
      data:{
  
        title:response.data.title,
        banner:{
          url:response.data.banner.url
        },
        author:response.data.author,
        content:response.data.content.map(content=>{
          return(
            {
              heading:content.heading,
                            
               body:[{
              text:RichText.asHtml(content.body)
            }]
          }
          )
        })
      }
    }

    return{
      props:{
        post
      }
    }
 
 };
